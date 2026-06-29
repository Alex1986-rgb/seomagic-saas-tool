#!/usr/bin/env node
/**
 * Ингест исправленных страниц (fixed_html) из клона site-clone.cjs в таблицу public.fixed_pages.
 * Закрывает разрыв P0 #10: «исправленная копия» появляется в БД, а не только локально.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/ingest-fixed-pages.cjs <cloneDir> [--audit <audit_id>] [--limit N]
 *
 * Читает <cloneDir>/_fixed-pages.json, по каждой странице берёт исправленный HTML из файла,
 * связывает с page_analysis по url (→ page_id, user_id) и upsert'ит в fixed_pages.
 * Запускать на РЕАЛЬНОМ бэкенде (локальный Supabase на 8GB не поднимается).
 */
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2];
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const AUDIT_ID = getOpt('--audit', null);
const LIMIT = Number(getOpt('--limit', 0)) || Infinity;
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DIR || !URL || !KEY) {
  console.error('Использование: SUPABASE_URL=.. SUPABASE_SERVICE_ROLE_KEY=.. node scripts/ingest-fixed-pages.cjs <cloneDir> [--audit id] [--limit N]');
  process.exit(1);
}

let createClient;
try { ({ createClient } = require('@supabase/supabase-js')); }
catch { console.error('Нужен пакет @supabase/supabase-js (есть в проекте: npm i внутри ~/seomagic-saas-tool).'); process.exit(1); }

(async () => {
  const manifestPath = path.join(DIR, '_fixed-pages.json');
  if (!fs.existsSync(manifestPath)) { console.error('Нет _fixed-pages.json — сгенерируй клон site-clone.cjs.'); process.exit(1); }
  const { pages } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const supabase = createClient(URL, KEY);

  let ok = 0, skip = 0, fail = 0;
  const list = pages.slice(0, LIMIT);
  for (const p of list) {
    try {
      const file = path.join(DIR, p.file);
      if (!fs.existsSync(file)) { skip++; continue; }
      const fixed_html = fs.readFileSync(file, 'utf8');
      // связь с page_analysis по url (мягкая: может не найтись)
      let page_id = null, user_id = null;
      const { data: pa } = await supabase.from('page_analysis').select('id, user_id').eq('url', p.url).limit(1).maybeSingle();
      if (pa) { page_id = pa.id; user_id = pa.user_id; }
      const row = {
        audit_id: AUDIT_ID, page_id, user_id,
        fixed_html,
        fixes_applied: { url: p.url, demo_url: p.demo_url, title: p.title, source: 'site-clone' },
        status: 'done',
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('fixed_pages').insert(row);
      if (error) { fail++; if (fail <= 5) console.error('  ✗', p.url, error.message); }
      else ok++;
      if ((ok + fail + skip) % 100 === 0) console.error(`  ${ok + fail + skip}/${list.length}…`);
    } catch (e) { fail++; if (fail <= 5) console.error('  ✗', p.url, e.message); }
  }
  console.log(JSON.stringify({ ingested: ok, skipped: skip, failed: fail, total: list.length }));
})();
