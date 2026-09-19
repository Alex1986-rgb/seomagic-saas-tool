import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SitePhoto } from '@/site/SitePhoto';
import { normalizeSiteUrl } from '@/cabinet/audit/run';
import { CHECKS, pathOf, stageLabel } from '@/cabinet/audit/labels';
import { hostOf, num, plural, rub } from '@/cabinet/format';
import { lineSum } from '@/cabinet/estimate/calc';
import { priceTypeOf } from '@/cabinet/estimate/works';
import type { PriceRule } from '@/cabinet/estimate/rates';
import { Blueprint, MUTED } from './parts';
import { useGuestAudit } from './useGuestAudit';

/**
 * Первый экран: форма проверки запускает настоящий аудит.
 *
 * Гость — быструю проверку прямо здесь (audit-start type=quick, до 10 страниц; см. useGuestAudit).
 * Вошедший — уходит в кабинет на экран «Новый аудит»: там аудит до 300 страниц сохраняется в его
 * историю, и дублировать этот экран на главной незачем.
 *
 * Число проверок — длина справочника CHECKS, зеркала классификатора issue-classifier. Та же
 * цифра стоит в разделе «Что проверяем»: две разных на одной странице недопустимы.
 */

const ACCENT_LABEL: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'var(--color-accent)',
};

export const Hero: React.FC<{ rules: PriceRule[] }> = ({ rules }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const run = useGuestAudit();
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const running = run.phase === 'running' || run.phase === 'scoring';
  const auditPath = (url: string) => ({
    pathname: '/app/audit',
    search: `?url=${encodeURIComponent(url)}`,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (running) return;
    const url = normalizeSiteUrl(value);
    if (!url) {
      setFormError('Укажите адрес сайта, например shop.ru');
      return;
    }
    setFormError(null);
    if (user.isLoggedIn) {
      const to = auditPath(url);
      navigate(`${to.pathname}${to.search}`);
      return;
    }
    void run.start(url);
  };

  const label = running ? 'Сканируем…' : run.phase === 'done' ? 'Проверить ещё раз' : 'Проверить';
  const p = run.progress;
  const pct = run.phase === 'scoring' ? 100 : (p?.progress ?? 0);
  const checkedUrl = run.task?.url ?? '';
  // Возврат после входа — на экран аудита с адресом, который человек уже ввёл.
  const from = checkedUrl ? auditPath(checkedUrl) : { pathname: '/app/audit', search: '' };
  const rateByType = new Map(rules.map((r) => [r.issueType, r.rate]));

  return (
    <section style={{ padding: '88px 0 64px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: 'clamp(38px,5.8vw,82px)',
          lineHeight: 1.04,
          letterSpacing: '.01em',
          textTransform: 'uppercase',
          margin: '0 0 0 -0.052em',
        }}
      >
        <span style={{ display: 'block' }}>SEO-аудит сайта бесплатно.</span>
        <span style={{ display: 'block', color: 'var(--color-accent-700)' }}>Платите за исправления.</span>
      </h1>

      <div data-hero style={{ marginTop: 32 }}>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.5,
              maxWidth: '58ch',
              margin: 0,
            }}
          >
            {CHECKS.length} проверок по технике, SEO, контенту и скорости. Каждая находка привязана к конкретным адресам, а смета
            считается по фактическому объёму правок — без подписки и без пакетов.
          </p>

          <form
            onSubmit={submit}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'stretch',
              maxWidth: 600,
              marginTop: 32,
              flexWrap: 'wrap',
            }}
          >
            <input
              id="audit"
              className="input"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="например, shop.ru"
              aria-label="Адрес сайта"
              aria-invalid={formError ? true : undefined}
              aria-describedby="audit-note"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                flex: 1,
                minWidth: 220,
                minHeight: 46,
                fontSize: 16,
                scrollMarginTop: 120,
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={running || run.busy}
              style={{
                minHeight: 46,
                paddingInline: 28,
                fontSize: 15,
                whiteSpace: 'nowrap',
              }}
            >
              {run.busy ? 'Запускаем…' : label}
            </button>
          </form>
          {formError && (
            <p
              role="alert"
              style={{
                fontSize: 13,
                color: 'var(--color-critical-ink)',
                margin: '10px 0 0',
              }}
            >
              {formError}
            </p>
          )}
          {/* Текст под формой повторяет то, что реально произойдёт: гостю — быстрая проверка до
              10 страниц без сохранения, полный аудит и смета — только в кабинете. */}
          <p
            id="audit-note"
            style={{
              fontSize: 13,
              color: MUTED,
              margin: '12px 0 0',
              maxWidth: '64ch',
            }}
          >
            {!isLoading && user.isLoggedIn
              ? 'Вы вошли в кабинет — проверка откроется там: аудит до 300 страниц сохранится в истории вместе со сметой.'
              : 'Без регистрации: быстрая проверка до 10 страниц, балл и главные проблемы — прямо здесь. Полный аудит до 300 страниц, отчёт и смета — в кабинете, карта не нужна.'}
          </p>
        </div>
        <div data-hero-photo>
          <SitePhoto id="blog-hero-1a" aspect="4/3" eager alt="Рабочий стол: ноутбук, блокнот и ручка" />
        </div>
      </div>

      {running && (
        <Blueprint
          style={{
            marginTop: 36,
            padding: 'var(--space-6)',
            display: 'grid',
            gap: 'var(--space-3)',
            maxWidth: 760,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
            }}
            aria-live="polite"
          >
            <span
              data-live
              style={{
                width: 7,
                height: 7,
                flex: 'none',
                background: 'var(--color-accent)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>
              {run.phase === 'scoring' ? 'Считаем балл и замечания' : `Сканируем ${checkedUrl ? hostOf(checkedUrl) : 'сайт'}`}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Ход проверки"
            style={{
              height: 8,
              background: 'color-mix(in srgb,var(--color-text) 9%,transparent)',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'repeating-linear-gradient(to right,var(--color-divider) 0 1px,transparent 1px 5%)',
            }}
          >
            <div
              data-bar
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                background: 'var(--color-accent)',
                width: `${pct}%`,
              }}
            />
          </div>
          <span style={{ fontSize: 12.5, color: MUTED, overflowWrap: 'anywhere' }}>
            {p
              ? `Этап: ${stageLabel(p.status, p.stage).toLowerCase()} · страниц проверено ${num(p.pagesScanned)}${p.estimatedPages ? ` из ${num(p.estimatedPages)}` : ''}${p.currentUrl && run.phase === 'running' ? ` · ${pathOf(p.currentUrl)}` : ''}`
              : 'Ставим проверку в очередь'}
          </span>
        </Blueprint>
      )}

      {run.phase === 'failed' && run.error && (
        <Blueprint
          style={{
            marginTop: 36,
            padding: 'var(--space-6)',
            display: 'grid',
            gap: 'var(--space-3)',
            maxWidth: 760,
          }}
        >
          <span style={{ ...ACCENT_LABEL, color: 'var(--color-critical-ink)' }}>Проверка не выполнена</span>
          <span role="alert" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
            {run.error}
          </span>
          <div>
            <button type="button" className="btn btn-secondary" onClick={run.reset}>
              Попробовать ещё раз
            </button>
          </div>
        </Blueprint>
      )}

      {run.phase === 'done' && run.result && (
        <Blueprint style={{ marginTop: 36, maxWidth: 940 }}>
          <div
            data-result
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 0,
            }}
          >
            <div
              style={{
                padding: 'var(--space-6)',
                borderBottom: '1px solid var(--color-divider)',
                display: 'grid',
                gap: 6,
                alignContent: 'start',
              }}
            >
              <span style={ACCENT_LABEL}>Предварительный балл</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 64,
                    lineHeight: 0.9,
                  }}
                >
                  {run.result.score !== null ? Math.round(run.result.score) : '—'}
                </span>
                <span style={{ fontSize: 14, color: MUTED }}>/100</span>
              </span>
              <span style={{ fontSize: 12.5, color: MUTED }}>
                {num(run.result.pagesScanned)} {plural(run.result.pagesScanned, ['страница', 'страницы', 'страниц'])} быстрой
                проверки · {num(run.result.issuesTotal)} {plural(run.result.issuesTotal, ['замечание', 'замечания', 'замечаний'])}
              </span>
            </div>
            <div
              style={{
                padding: 'var(--space-6)',
                borderBottom: '1px solid var(--color-divider)',
                display: 'grid',
                gap: 'var(--space-3)',
                alignContent: 'start',
                minWidth: 0,
              }}
            >
              <span style={ACCENT_LABEL}>Три главные проблемы</span>
              {run.result.top.length === 0 ? (
                <span style={{ fontSize: 13.5 }}>На проверенных страницах замечаний не нашлось.</span>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--space-2)',
                    fontSize: 13.5,
                  }}
                >
                  {run.result.top.map((g) => {
                    // Сумма — тем же расчётом, что смета кабинета: ставка из pricing_rules × объём.
                    // Нет ставки в прайсе — суммы не пишем, а не 0 ₽.
                    const priceType = priceTypeOf(g.type);
                    const rate = rateByType.get(priceType);
                    const qty = run.result?.qtyByPriceType.get(priceType) ?? g.count;
                    return (
                      <span
                        key={g.type}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 'var(--space-3)',
                        }}
                      >
                        <span>
                          {g.title} — {num(g.count)} {plural(g.count, ['страница', 'страницы', 'страниц'])}
                        </span>
                        {rate !== undefined && (
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {rub(lineSum(qty, rate).sum)}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              padding: 'var(--space-6)',
              display: 'grid',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Полный аудит и смета — в кабинете
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                margin: 0,
                maxWidth: '72ch',
              }}
            >
              Быстрая проверка смотрит до 10 страниц и в аккаунт не сохраняется. Зарегистрируйтесь — и запустите аудит до 300
              страниц: отчёт по каждому адресу, смета по ставкам и история проверок останутся в кабинете.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
              }}
            >
              <Link to="/app/register" state={{ from }} className="btn btn-primary">
                Зарегистрироваться и запустить полный аудит
              </Link>
              <Link to="/app/login" state={{ from }} className="btn btn-secondary">
                Войти
              </Link>
            </div>
          </div>
        </Blueprint>
      )}
    </section>
  );
};
