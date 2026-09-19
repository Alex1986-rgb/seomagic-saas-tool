import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PageSeo } from '@/components/seo/PageSeo';
import { NavIcons, type NavIconId } from './icons';
import { useCabinetProject } from './project';
import { dateLong } from './format';
import { MUTED } from './ui';
import { EstimateChip } from './estimate-chip';
import { useCabinetTheme } from '@/design/industry';

/**
 * Оболочка кабинета: сайдбар 212px + липкая шапка + область экрана.
 * Разметка и отступы — из макета (строки 79–194 SeoMarket v2.dc.html).
 */

// Тема и класс ds-industry на <html> — общие с публичным сайтом, живут в src/design/industry.tsx.
// Реэкспорт: экраны без оболочки (оплата, смета по ссылке) импортируют хук отсюда.
export { useIndustryDocument, useCabinetTheme } from '@/design/industry';

interface NavItem {
  id: NavIconId;
  to: string;
  label: string;
  /** Точное совпадение адреса: «Обзор» (/app) не должен гореть на всех экранах. */
  end?: boolean;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Аудит',
    items: [
      { id: 'overview', to: '/app', label: 'Обзор', end: true },
      { id: 'audit', to: '/app/audit', label: 'Новый аудит' },
      { id: 'results', to: '/app/results', label: 'Результаты' },
      { id: 'page', to: '/app/page', label: 'Страница' },
      { id: 'optimize', to: '/app/optimize', label: 'Оптимизация' },
      { id: 'estimate', to: '/app/estimate', label: 'Смета' },
      { id: 'order', to: '/app/order', label: 'Исправление' },
    ],
  },
  {
    title: 'Аналитика',
    items: [
      { id: 'positions', to: '/app/positions', label: 'Позиции' },
      { id: 'rivals', to: '/app/rivals', label: 'Конкуренты' },
      { id: 'history', to: '/app/history', label: 'История' },
      { id: 'reports', to: '/app/reports', label: 'Отчёты' },
    ],
  },
  {
    title: 'Аккаунт',
    items: [
      { id: 'alerts', to: '/app/alerts', label: 'Уведомления' },
      { id: 'settings', to: '/app/settings', label: 'Настройки' },
      { id: 'admin', to: '/app/admin', label: 'Админ' },
    ],
  },
];

/** Пункт подсвечен и на вложенных адресах: /app/admin/rates — это «Админ». */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.end) return pathname === item.to || pathname === `${item.to}/`;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/** Непрочитанные уведомления — счётчик у пункта «Уведомления». Только свои: RLS + явный user_id. */
function useUnreadCount(userId: string | null, pathname: string) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    let alive = true;
    void supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
      .then(({ count: c }) => {
        if (alive) setCount(c ?? 0);
      });
    return () => {
      alive = false;
    };
    // Пересчёт при смене экрана: прочитал на «Уведомлениях» — бейдж гаснет при переходе.
  }, [userId, pathname]);
  return count;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

const ProjectSwitcher: React.FC = () => {
  const { projects, host, setHost } = useCabinetProject();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div data-railhide ref={ref} style={{ margin: '0 var(--space-3) var(--space-4)', position: 'relative' }}>
      <button
        type="button"
        data-hover-accent
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-3)',
          border: '1px solid var(--color-divider)',
          background: 'transparent',
          color: 'inherit',
          font: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'grid',
          gap: 1,
          minWidth: 0,
        }}
      >
        <span style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: MUTED }}>Проект</span>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {host ?? 'Нет проектов'}
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 'calc(100% + 4px)',
            zIndex: 20,
            background: 'var(--color-bg)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
          }}
        >
          {projects.map((p) => (
            <button
              key={p.host}
              type="button"
              role="option"
              aria-selected={p.host === host}
              data-nav
              data-active={p.host === host ? '1' : '0'}
              onClick={() => {
                setHost(p.host);
                setOpen(false);
              }}
              style={{
                border: 0,
                background: 'transparent',
                color: 'inherit',
                font: 'inherit',
                fontSize: 13,
                textAlign: 'left',
                padding: '7px var(--space-3)',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.host}
            </button>
          ))}
          <Link
            to="/app/onboarding"
            onClick={() => setOpen(false)}
            style={{ fontSize: 13, padding: '7px var(--space-3)', borderTop: '1px solid var(--color-divider)' }}
          >
            Добавить проект
          </Link>
        </div>
      )}
    </div>
  );
};

const CabinetLayout: React.FC = () => {
  const { theme, toggle } = useCabinetTheme();
  const { user } = useAuth();
  const { project, userId } = useCabinetProject();
  const location = useLocation();
  const navigate = useNavigate();
  const unread = useUnreadCount(userId, location.pathname);

  const name = user.profile?.full_name || user.user?.email || 'Аккаунт';
  const last = project?.lastAudit;

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* Кабинет — личные данные: в поиск не отдаём. */}
      <PageSeo title="Кабинет — SeoMarket" description="Личный кабинет SeoMarket" noindex />
      <div data-shell style={{ display: 'grid', gridTemplateColumns: '212px minmax(0,1fr)', minHeight: '100vh' }}>
        <aside
          data-rail
          style={{
            borderRight: '1px solid var(--color-divider)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            minWidth: 0,
            overflowY: 'auto',
          }}
        >
          <div data-railhide style={{ padding: 'var(--space-4) var(--space-4) var(--space-3)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, letterSpacing: '.04em', color: 'inherit', textDecoration: 'none' }}>
              SEOMARKET
            </Link>
            <span style={{ fontSize: 10, letterSpacing: '.12em', color: 'var(--color-accent)' }}>2.0</span>
          </div>

          <ProjectSwitcher />

          {GROUPS.map((group, gi) => {
            const items = group.items.filter((i) => i.id !== 'admin' || user.isAdmin);
            return (
              <React.Fragment key={group.title}>
                <div
                  data-railhide
                  style={{
                    fontSize: 9,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    padding: gi === 0 ? '0 var(--space-4) var(--space-2)' : 'var(--space-4) var(--space-4) var(--space-2)',
                  }}
                >
                  {group.title}
                </div>
                <nav
                  aria-label={group.title}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    padding: gi === GROUPS.length - 1 ? '0 var(--space-2) var(--space-4)' : '0 var(--space-2)',
                  }}
                >
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      data-nav
                      data-active={isActive(item, location.pathname) ? '1' : '0'}
                      aria-current={isActive(item, location.pathname) ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                        padding: '7px var(--space-3)',
                        fontSize: 13.5,
                        color: 'inherit',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <span data-bar style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, background: 'transparent' }} />
                      {NavIcons[item.id]}
                      {item.label}
                      {item.id === 'alerts' && unread > 0 && (
                        <span
                          style={{
                            marginLeft: 'auto',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 11,
                            padding: '1px 6px',
                            background: 'var(--color-accent)',
                            color: 'var(--color-bg)',
                          }}
                        >
                          {unread > 99 ? '99+' : unread}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </React.Fragment>
            );
          })}

          <div
            data-railhide
            style={{
              marginTop: 'auto',
              padding: 'var(--space-3) var(--space-4)',
              borderTop: '1px solid var(--color-divider)',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                flex: 'none',
                border: '1px solid var(--color-divider)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: 12,
              }}
            >
              {initials(name)}
            </span>
            <span style={{ display: 'grid', minWidth: 0 }}>
              <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <span style={{ fontSize: 10, color: MUTED }}>Оплата за исправления</span>
            </span>
          </div>
        </aside>

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <header
            data-topbar
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 5,
              background: 'var(--color-bg)',
              borderBottom: '1px solid var(--color-divider)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-6)',
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: 12.5, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {last
                ? `${last.url} · последний аудит ${dateLong(last.createdAt)}`
                : 'Проектов пока нет — запустите первый аудит'}
            </span>
            <span style={{ flex: 1 }} />
            <EstimateChip />
            <button type="button" className="btn btn-secondary" onClick={toggle} style={{ whiteSpace: 'nowrap' }}>
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/app/audit')} style={{ whiteSpace: 'nowrap' }}>
              Запустить аудит
            </button>
          </header>

          <div data-main style={{ padding: 'var(--space-8) var(--space-6) 64px', minWidth: 0, flex: 1 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetLayout;
