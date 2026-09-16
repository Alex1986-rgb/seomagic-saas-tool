#!/usr/bin/env node
/**
 * zip-fixed-site.cjs — ZIP-экспорт исправленного клона сайта (P1 #11)
 *
 * Упаковывает папку клона (результат site-clone.cjs) в один .zip для выдачи клиенту.
 * Использует системный `zip` (spawn). Исключает внутренние артефакты пайплайна:
 *   - _fixed-pages.json   (метаданные правок, не для клиента)
 *   - sitemap-local.xml   (локальный sitemap с file://-путями)
 *
 * Usage:
 *   node scripts/zip-fixed-site.cjs <cloneDir> [--out file.zip]
 *
 * Examples:
 *   node scripts/zip-fixed-site.cjs ./out/rimmebel
 *   node scripts/zip-fixed-site.cjs /abs/path/clone --out /abs/path/rimmebel-fixed.zip
 *
 * Вывод: JSON в stdout — { out, files, size_mb }
 *   out      — абсолютный путь к созданному архиву
 *   files    — число упакованных файлов
 *   size_mb  — размер архива в мегабайтах
 *
 * Exit codes: 0 — успех; 1 — ошибка (нет zip / нет папки / сбой упаковки).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

// Файлы, исключаемые из архива клиента (точные имена в любой подпапке).
const EXCLUDES = ['_fixed-pages.json', 'sitemap-local.xml'];

function fail(msg) {
  process.stderr.write(`[zip-fixed-site] error: ${msg}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { cloneDir: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' || a === '-o') {
      args.out = argv[++i];
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    } else if (!args.cloneDir) {
      args.cloneDir = a;
    }
  }
  return args;
}

function checkZipAvailable() {
  const probe = spawnSync('zip', ['-v'], { stdio: 'ignore' });
  if (probe.error || probe.status == null) {
    fail("системная утилита 'zip' не найдена в PATH — установите zip и повторите");
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.cloneDir) {
    process.stdout.write(
      'Usage: node scripts/zip-fixed-site.cjs <cloneDir> [--out file.zip]\n'
    );
    process.exit(args.help ? 0 : 1);
  }

  const cloneDir = path.resolve(args.cloneDir);
  let st;
  try {
    st = fs.statSync(cloneDir);
  } catch {
    fail(`папка клона не найдена: ${cloneDir}`);
  }
  if (!st.isDirectory()) {
    fail(`путь не является папкой: ${cloneDir}`);
  }

  checkZipAvailable();

  // Имя архива по умолчанию: <имя-папки>-fixed.zip рядом с папкой клона.
  const out = args.out
    ? path.resolve(args.out)
    : path.join(path.dirname(cloneDir), `${path.basename(cloneDir)}-fixed.zip`);

  // Убираем старый архив, чтобы zip не дописывал в существующий.
  try {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  } catch (e) {
    fail(`не удалось удалить существующий архив ${out}: ${e.message}`);
  }

  // Папка назначения должна существовать.
  try {
    fs.mkdirSync(path.dirname(out), { recursive: true });
  } catch (e) {
    fail(`не удалось создать папку для архива: ${e.message}`);
  }

  // zip -r -q <out> . -x <patterns>   (cwd = cloneDir → пути в архиве относительные)
  const zipArgs = ['-r', '-q', out, '.'];
  for (const name of EXCLUDES) {
    zipArgs.push('-x', name, `*/${name}`);
  }

  const child = spawn('zip', zipArgs, { cwd: cloneDir, stdio: ['ignore', 'ignore', 'inherit'] });

  child.on('error', (e) => fail(`не удалось запустить zip: ${e.message}`));

  child.on('close', (code) => {
    if (code !== 0) {
      fail(`zip завершился с кодом ${code}`);
    }

    let sizeBytes = 0;
    try {
      sizeBytes = fs.statSync(out).size;
    } catch (e) {
      fail(`архив не создан: ${e.message}`);
    }

    // Подсчёт числа файлов в архиве: `zip -sf` выводит листинг.
    let files = 0;
    const sf = spawnSync('zip', ['-sf', out], { encoding: 'utf8' });
    if (!sf.error && typeof sf.stdout === 'string') {
      const m = sf.stdout.match(/Total\s+(\d+)\s+entries/i);
      if (m) {
        files = parseInt(m[1], 10);
      } else {
        // Фолбэк: считаем строки-записи (отступ-таб) между заголовком и "Total".
        files = sf.stdout
          .split('\n')
          .filter((l) => /^\s+\S/.test(l) && !/entries in this zip file/i.test(l)).length;
      }
    }

    const result = {
      out,
      files,
      size_mb: Math.round((sizeBytes / (1024 * 1024)) * 100) / 100,
    };
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(0);
  });
}

main();
