/**
 * Мок-клиент Supabase для демо/офлайн-режима.
 *
 * Активируется автоматически из ./client.ts, когда не заданы реальные ключи
 * (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Эмулирует ту часть API
 * supabase-js, которую использует приложение: auth, query-builder для таблиц,
 * functions.invoke (edge-функции), realtime-каналы и storage — чтобы весь
 * интерфейс был полностью рабочим без бэкенда.
 */
import { DEMO_USER, DEMO_SESSION, createDemoTables, buildAuditData } from './demoData';

const genId = () =>
  'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const nowIso = () => new Date().toISOString();

// ---- In-memory store -------------------------------------------------------
const store: Record<string, any[]> = createDemoTables();
const getTable = (name: string): any[] => {
  if (!store[name]) store[name] = [];
  return store[name];
};

// ---- Query builder ---------------------------------------------------------
type Filter = { col: string; val: any; op: string };

class MockQueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private op: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private wantSingle = false;
  private wantMaybe = false;
  private orderCol?: string;
  private orderAsc = true;
  private limitN?: number;
  private returnAfterWrite = false;
  private selectStr = '';

  constructor(table: string) {
    this.table = table;
  }

  // mutations
  select(cols?: string) {
    this.selectStr = cols || '';
    if (this.op !== 'select') this.returnAfterWrite = true;
    return this;
  }
  insert(payload: any) {
    this.op = 'insert';
    this.payload = payload;
    return this;
  }
  upsert(payload: any) {
    this.op = 'insert';
    this.payload = payload;
    return this;
  }
  update(payload: any) {
    this.op = 'update';
    this.payload = payload;
    return this;
  }
  delete() {
    this.op = 'delete';
    return this;
  }

  // filters — only eq actually narrows; others are accepted as no-ops
  eq(col: string, val: any) {
    this.filters.push({ col, val, op: 'eq' });
    return this;
  }
  neq() { return this; }
  gt() { return this; }
  gte() { return this; }
  lt() { return this; }
  lte() { return this; }
  like() { return this; }
  ilike() { return this; }
  is() { return this; }
  in(col: string, vals: any[]) {
    this.filters.push({ col, val: vals, op: 'in' });
    return this;
  }
  contains() { return this; }
  or() { return this; }
  not() { return this; }
  filter() { return this; }
  match(obj: Record<string, any>) {
    Object.entries(obj || {}).forEach(([col, val]) => this.filters.push({ col, val, op: 'eq' }));
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }
  limit(n: number) {
    this.limitN = n;
    return this;
  }
  range() { return this; }
  single() {
    this.wantSingle = true;
    return this;
  }
  maybeSingle() {
    this.wantMaybe = true;
    return this;
  }

  private applyFilters(rows: any[]) {
    let out = rows;
    for (const f of this.filters) {
      if (f.op === 'eq') out = out.filter((r) => r?.[f.col] === f.val);
      else if (f.op === 'in') out = out.filter((r) => Array.isArray(f.val) && f.val.includes(r?.[f.col]));
    }
    return out;
  }

  private async run() {
    try {
      const table = getTable(this.table);

      if (this.op === 'delete') {
        const toRemove = new Set(this.applyFilters(table));
        store[this.table] = table.filter((r) => !toRemove.has(r));
        return { data: null, error: null, count: 0 };
      }

      if (this.op === 'insert') {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload];
        const inserted = items.map((it) => ({
          id: it?.id ?? genId(),
          created_at: it?.created_at ?? nowIso(),
          ...it,
        }));
        table.push(...inserted);
        const data = this.wantSingle || this.wantMaybe ? inserted[0] : inserted;
        return { data: this.returnAfterWrite ? data : inserted, error: null };
      }

      if (this.op === 'update') {
        const matched = this.applyFilters(table);
        matched.forEach((row) => Object.assign(row, this.payload, { updated_at: nowIso() }));
        const data = this.wantSingle || this.wantMaybe ? matched[0] ?? null : matched;
        return { data: this.returnAfterWrite ? data : matched, error: null };
      }

      // select
      let rows = this.applyFilters(table).map((r) => ({ ...r }));

      // page_analysis: если по запрошенному audit_id нет строк (демо buildAuditData
      // использует id вида demo-audit-<domain>, а строки — demo-audit-1/2),
      // отдаём страницы первого демо-аудита, проставив запрошенный audit_id.
      if (this.table === 'page_analysis' && rows.length === 0) {
        const auditFilter = this.filters.find((f) => f.col === 'audit_id' && f.op === 'eq');
        if (auditFilter) {
          const sample = getTable('page_analysis').filter((p) => p.audit_id === 'demo-audit-1');
          rows = sample.map((p) => ({ ...p, audit_id: auditFilter.val }));
        }
      }

      // profiles: резолвим embed-связи user_roles(role) и projects(count),
      // которые использует админ-панель (AdminUsers).
      if (this.table === 'profiles' && /user_roles/.test(this.selectStr)) {
        const roles = getTable('user_roles');
        rows = rows.map((r) => ({
          ...r,
          user_roles: roles.filter((ur) => ur.user_id === r.id).map((ur) => ({ role: ur.role })),
          projects: [{ count: getTable('audits').filter((a) => a.user_id === r.id).length }],
        }));
      }

      if (this.orderCol) {
        const col = this.orderCol;
        rows.sort((a, b) => {
          const av = a?.[col];
          const bv = b?.[col];
          if (av === bv) return 0;
          const cmp = av > bv ? 1 : -1;
          return this.orderAsc ? cmp : -cmp;
        });
      }
      if (this.limitN != null) rows = rows.slice(0, this.limitN);

      if (this.wantSingle || this.wantMaybe) {
        return { data: rows[0] ?? null, error: null };
      }
      return { data: rows, error: null, count: rows.length };
    } catch (e: any) {
      return { data: null, error: { message: e?.message || 'mock error' } };
    }
  }

  // thenable — allows `await supabase.from(...).select()...`
  then(resolve: (v: any) => any, reject?: (e: any) => any) {
    return this.run().then(resolve, reject);
  }
  catch(reject: (e: any) => any) {
    return this.run().catch(reject);
  }
}

// ---- Auth ------------------------------------------------------------------
type AuthCallback = (event: string, session: any) => void;

class MockAuth {
  private listeners: AuthCallback[] = [];
  private loggedIn = true; // в демо-режиме пользователь авторизован по умолчанию

  async getSession() {
    return { data: { session: this.loggedIn ? DEMO_SESSION : null }, error: null };
  }
  async getUser() {
    return { data: { user: this.loggedIn ? DEMO_USER : null }, error: null };
  }
  onAuthStateChange(cb: AuthCallback) {
    this.listeners.push(cb);
    // эмулируем начальное событие
    setTimeout(() => cb('INITIAL_SESSION', this.loggedIn ? DEMO_SESSION : null), 0);
    return {
      data: {
        subscription: {
          id: genId(),
          callback: cb,
          unsubscribe: () => {
            this.listeners = this.listeners.filter((l) => l !== cb);
          },
        },
      },
    };
  }
  private emit(event: string) {
    const session = this.loggedIn ? DEMO_SESSION : null;
    this.listeners.forEach((l) => l(event, session));
  }
  async signInWithPassword(_creds: any) {
    this.loggedIn = true;
    this.emit('SIGNED_IN');
    return { data: { user: DEMO_USER, session: DEMO_SESSION }, error: null };
  }
  async signUp(_creds: any) {
    this.loggedIn = true;
    this.emit('SIGNED_IN');
    return { data: { user: DEMO_USER, session: DEMO_SESSION }, error: null };
  }
  async signInWithOAuth(_opts: any) {
    this.loggedIn = true;
    this.emit('SIGNED_IN');
    return { data: { provider: 'demo', url: window.location.origin + '/' }, error: null };
  }
  async signOut() {
    this.loggedIn = false;
    this.emit('SIGNED_OUT');
    return { error: null };
  }
  async resetPasswordForEmail() {
    return { data: {}, error: null };
  }
  async updateUser() {
    return { data: { user: DEMO_USER }, error: null };
  }
}

// ---- Edge functions --------------------------------------------------------
const taskPolls: Record<string, number> = {};
const taskUrls: Record<string, string> = {};

async function invokeFunction(name: string, options?: { body?: any }) {
  const body = options?.body || {};
  await new Promise((r) => setTimeout(r, 150)); // имитация сети

  switch (name) {
    case 'audit-start': {
      const taskId = 'demo-task-' + genId();
      const auditId = 'demo-audit-' + genId();
      const url = body.url || 'https://example.com';
      taskPolls[taskId] = 0;
      taskUrls[taskId] = url;
      getTable('audits').unshift({
        id: auditId,
        user_id: DEMO_USER.id,
        url,
        status: 'scanning',
        pages_scanned: 0,
        total_pages: 42,
        seo_score: null,
        created_at: nowIso(),
      });
      getTable('audit_tasks').unshift({
        id: taskId,
        audit_id: auditId,
        user_id: DEMO_USER.id,
        url,
        status: 'scanning',
        stage: 'crawling',
        progress: 0,
        pages_scanned: 0,
        estimated_pages: 42,
        created_at: nowIso(),
        updated_at: nowIso(),
      });
      return { data: { task_id: taskId, audit_id: auditId, status: 'queued' }, error: null };
    }

    case 'audit-status': {
      const taskId = body.task_id;
      const url = taskUrls[taskId] || 'https://example.com';
      const polls = (taskPolls[taskId] = (taskPolls[taskId] ?? 4) + 1);
      const total = 42;
      const progress = Math.min(100, polls * 22);
      const done = progress >= 100;
      const pagesScanned = Math.round((progress / 100) * total);
      const stages = ['crawling', 'analyzing', 'scoring', 'completed'];
      const stage = done ? 'completed' : stages[Math.min(stages.length - 2, Math.floor(progress / 34))];
      return {
        data: {
          task_id: taskId,
          url,
          status: done ? 'completed' : 'scanning',
          progress,
          pages_scanned: pagesScanned,
          total_pages: total,
          estimated_pages: total,
          stage,
          current_url: done ? undefined : `${url}/page-${pagesScanned}`,
          audit_data: done ? buildAuditData(url, 78) : undefined,
        },
        error: null,
      };
    }

    case 'audit-cancel':
      return { data: { success: true, status: 'cancelled' }, error: null };
    case 'audit-resume':
      return { data: { success: true, task_id: body.task_id || genId(), status: 'scanning' }, error: null };

    case 'optimization-start': {
      const id = 'demo-opt-' + genId();
      return { data: { job_id: id, optimization_id: id, status: 'processing' }, error: null };
    }
    case 'optimization-status':
      return {
        data: {
          status: 'completed',
          progress: 100,
          optimized_pages: 42,
          total_pages: 42,
          download_url: '#',
          result_data: {
            optimized_pages: 42,
            total_pages: 42,
            total_cost: 24500,
            estimated_score_improvement: 14,
            improvements: [
              { url: '/', type: 'meta', description: 'Добавлены мета-описания' },
              { url: '/catalog', type: 'images', description: 'Сжаты изображения, добавлены alt' },
              { url: '/blog', type: 'content', description: 'Оптимизирована структура заголовков' },
            ],
          },
        },
        error: null,
      };
    case 'optimization-content':
      return { data: { content: 'Демонстрационный оптимизированный контент', success: true }, error: null };
    case 'optimization-calculate':
      return { data: { total_cost: 24500, items: buildAuditData(body.url || '').optimizationItems }, error: null };

    case 'admin-stats':
      return {
        data: {
          total_users: 1280,
          total_audits: 5340,
          active_optimizations: 12,
          revenue: 482000,
          audits_today: 37,
          users_growth: 8.4,
        },
        error: null,
      };
    case 'admin-users':
      return { data: { users: getTable('profiles'), total: getTable('profiles').length }, error: null };

    case 'report-generate':
    case 'generate-report':
    case 'pdf-report-generate':
      return { data: { success: true, report_url: '#', report_id: 'demo-report-' + genId() }, error: null };

    case 'cleanup-old-data':
    case 'cleanup-stuck-tasks':
      return { data: { success: true, stats: { total: 0, audits: 0, tasks: 0, reports: 0 } }, error: null };
    case 'report-download':
      return { data: { url: '#', success: true }, error: null };
    case 'sitemap-export':
    case 'generate-sitemap':
      return { data: { sitemap: '<?xml version="1.0"?><urlset></urlset>', success: true }, error: null };
    case 'send-email':
    case 'send-estimate-email':
    case 'create-notification':
      return { data: { success: true, sent: true }, error: null };
    case 'health-check':
      return { data: { status: 'ok', demo: true }, error: null };

    default:
      return { data: { success: true, demo: true }, error: null };
  }
}

// ---- Realtime (no-op) ------------------------------------------------------
function makeChannel(_name: string) {
  const channel: any = {
    on: () => channel,
    subscribe: (cb?: (status: string) => void) => {
      if (cb) setTimeout(() => cb('SUBSCRIBED'), 0);
      return channel;
    },
    unsubscribe: async () => ({ error: null }),
    send: async () => ({ error: null }),
    track: async () => ({ error: null }),
  };
  return channel;
}

// ---- Storage (stub) --------------------------------------------------------
function makeStorageBucket(_bucket: string) {
  return {
    upload: async (path: string) => ({ data: { path }, error: null }),
    download: async () => ({ data: new Blob(['demo']), error: null }),
    remove: async () => ({ data: [], error: null }),
    list: async () => ({ data: [], error: null }),
    getPublicUrl: (path: string) => ({ data: { publicUrl: `#${path}` } }),
    createSignedUrl: async (path: string) => ({ data: { signedUrl: `#${path}` }, error: null }),
  };
}

// ---- Client ----------------------------------------------------------------
export function createMockSupabaseClient(): any {
  const auth = new MockAuth();
  return {
    __isMock: true,
    auth,
    from: (table: string) => new MockQueryBuilder(table),
    rpc: async (_fn: string, _args?: any) => ({ data: null, error: null }),
    functions: { invoke: invokeFunction },
    channel: (name: string) => makeChannel(name),
    removeChannel: async () => ({ error: null }),
    removeAllChannels: async () => ({ error: null }),
    getChannels: () => [],
    storage: { from: (bucket: string) => makeStorageBucket(bucket) },
  };
}
