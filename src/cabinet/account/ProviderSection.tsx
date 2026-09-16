import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ErrorNote, Loading, MUTED } from '../ui';
import { dateShort, num } from '../format';
import { OffTag, Row } from './parts';
import { SettingsSection } from './SettingsSection';

/**
 * Поставщик поисковой выдачи (макет, блок «XMLRiver»).
 *
 * Что настоящее: проверки позиций пользователя из position_checks — через какого поставщика
 * прошла последняя, сколько проверок и запросов за текущий месяц. Поставщика и ключи выбирает
 * сервер (supabase/functions/_shared/serp.ts, секреты XMLRIVER_USER/XMLRIVER_KEY); в браузер
 * ключ не отдаётся и отдаваться не должен — поэтому поля «Ключ доступа» из макета нет.
 *
 * Чего нет: функции, которая спрашивает у XMLRiver баланс, — поэтому баланс и «хватит на»
 * без цифр. Частотности Wordstat, анкоры перелинковки и «остановка при балансе ниже 500 ₽»
 * из макета в коде не существуют: serp.ts снимает только позиции.
 */

interface CheckRow {
  provider: string | null;
  status: string;
  created_at: string;
  keywords_checked: number;
}

const PROVIDER_NAMES: Record<string, string> = {
  xmlriver: 'XMLRiver',
  dataforseo: 'DataForSEO',
  serpapi: 'SerpApi',
};

function monthStartIso(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

const ValueCell: React.FC<{ label: string; children: React.ReactNode; small?: boolean }> = ({ label, children, small }) => (
  <div style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)', minWidth: 0 }}>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>{label}</div>
    <div
      style={
        small
          ? { fontSize: 13, color: MUTED, marginTop: 8 }
          : { fontFamily: 'var(--font-heading)', fontSize: 30, wordBreak: 'break-word' }
      }
    >
      {children}
    </div>
  </div>
);

export const ProviderSection: React.FC<{ userId: string | null }> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<CheckRow | null>(null);
  const [month, setMonth] = useState<CheckRow[]>([]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    // user_id явно: без фильтра администратор увидел бы в «своих» настройках чужие проверки.
    Promise.all([
      supabase
        .from('position_checks')
        .select('provider, status, created_at, keywords_checked')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('position_checks')
        .select('provider, status, created_at, keywords_checked')
        .eq('user_id', userId)
        .gte('created_at', monthStartIso())
        .limit(1000),
    ])
      .then(([lastRes, monthRes]) => {
        if (!alive) return;
        const err = lastRes.error ?? monthRes.error;
        if (err) {
          setError(err.message);
          return;
        }
        setLast((lastRes.data?.[0] as CheckRow | undefined) ?? null);
        setMonth((monthRes.data ?? []) as CheckRow[]);
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : 'неизвестная ошибка');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const providerName = last?.provider ? PROVIDER_NAMES[last.provider] ?? last.provider : null;
  // Статус выводим из последней проверки, а не пишем «Подключён» наугад: из браузера секреты
  // сервера не видны, а факт успешной проверки — виден.
  const failed = last?.status === 'failed' || last?.status === 'error';
  const keywordsMonth = month.reduce((sum, r) => sum + (r.keywords_checked ?? 0), 0);

  return (
    <SettingsSection
      blueprint
      head={
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ width: 8, height: 8, flex: 'none', background: last && !failed ? 'var(--color-accent)' : MUTED }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>{providerName ?? 'Поставщик выдачи'}</span>
              {last && !failed && <span className="tag tag-accent">Работает</span>}
              {last && failed && <span className="tag tag-neutral">Последняя проверка не удалась</span>}
              {!last && !loading && !error && <span className="tag tag-neutral">Проверок ещё не было</span>}
            </div>
            <div style={{ fontSize: 12.5, color: MUTED }}>
              Выдача Яндекса и Google для проверки позиций. Ключи хранятся в секретах сервера и в кабинет не передаются.
            </div>
          </div>
          <Link to="/app/positions" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
            Открыть позиции
          </Link>
        </div>
      }
    >
      {loading && <Loading />}
      {error && <ErrorNote>Не удалось загрузить проверки позиций: {error}</ErrorNote>}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 1 }}>
          <ValueCell label="Последняя проверка" small={!last}>
            {last ? <span style={{ fontSize: 20 }}>{dateShort(last.created_at)}</span> : 'не было'}
          </ValueCell>
          <ValueCell label="Проверок за месяц">{num(month.length)}</ValueCell>
          <ValueCell label="Запросов за месяц">{num(keywordsMonth)}</ValueCell>
          <ValueCell label="Баланс" small>
            не подключён: нет функции запроса баланса у поставщика
          </ValueCell>
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--space-3)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)' }}>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>Где используется</div>
        <Row title="Проверка позиций в Яндексе и Google" sub="Экран «Позиции»: регион и глубина задаются при запуске проверки" right={<span className="tag tag-accent">Используется</span>} />
        <Row
          title="Частотности Wordstat для title, description и анкоров"
          sub="Запросы частотности к поставщику в коде не реализованы"
          right={<OffTag />}
          last
        />
      </div>
    </SettingsSection>
  );
};
