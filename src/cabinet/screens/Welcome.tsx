import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageSeo } from '@/components/seo/PageSeo';
import { useCabinetTheme } from '../CabinetLayout';
import { useCabinetProject } from '../project';
import { Blueprint, ErrorNote, Loading, MUTED } from '../ui';
import { CHECKS } from '../audit/labels';

/**
 * «Первый вход / нет проектов» — макет, строки 2519–2561. Экран без сайдбара: пустой кабинет
 * с десятком пунктов меню, где за каждым пусто, пугает сильнее, чем помогает.
 *
 * Тексты макета поправлены под то, что продукт реально делает: обход ограничен 300 страницами
 * (а не «3 500 за четыре минуты»), число проверок — из справочника классификатора (а не «214»),
 * подтверждения прав на сайт в бэкенде нет — шаг про него не обещаем.
 */

const STEPS: { title: string; text: string }[] = [
  { title: 'Добавьте сайт', text: 'Укажите адрес — обход до 300 страниц запускается сразу, аудит бесплатный.' },
  {
    title: 'Дождитесь отчёта',
    text: `${CHECKS.length} проверок по каждой странице; когда аудит закончится, в кабинете появится уведомление.`,
  },
  { title: 'Выберите правки', text: 'Смета соберётся из найденного; деньги в холде до одобрения превью.' },
];

const Welcome: React.FC = () => {
  useCabinetTheme();
  const { user, logout } = useAuth();
  const { loading, error, audits } = useCabinetProject();
  const navigate = useNavigate();

  // Проекты уже есть — приветствие не нужно. Обзор ведёт сюда только при нуле аудитов, петли нет.
  if (!loading && !error && audits.length > 0) return <Navigate to="/app" replace />;

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      <PageSeo title="Добро пожаловать — SeoMarket" description="Личный кабинет SeoMarket" noindex />
      <div
        data-screen
        style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-8) var(--space-6) 64px', display: 'grid', gap: 'var(--space-8)' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--color-divider)',
            paddingBottom: 'var(--space-4)',
          }}
        >
          <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, letterSpacing: '.04em', color: 'inherit', textDecoration: 'none' }}>
            SEOMARKET
          </Link>
          {user.user?.email && <span style={{ fontSize: 12.5, color: MUTED, overflowWrap: 'anywhere' }}>{user.user.email}</span>}
          <a
            href="/app/login"
            onClick={(e) => {
              e.preventDefault();
              void logout().then(() => navigate('/app/login'));
            }}
            style={{ fontSize: 13, marginLeft: 'auto' }}
          >
            Выйти
          </a>
        </div>

        <div>
          <h1 style={{ fontSize: 36, margin: '0 0 4px' }}>Добро пожаловать</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Аккаунт создан. Осталось добавить сайт — первый аудит запустится сразу.</p>
        </div>

        {error && <ErrorNote>Не удалось проверить проекты: {error}</ErrorNote>}

        {loading ? (
          <Loading />
        ) : (
          <Blueprint style={{ padding: '64px var(--space-8)', display: 'grid', gap: 'var(--space-3)', justifyItems: 'center', textAlign: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" />
              <path d="M3 9h18" />
              <path d="M8 14h8" />
            </svg>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>Ни одного проекта</span>
            <span style={{ fontSize: 13.5, color: MUTED, maxWidth: '52ch' }}>
              Аудит бесплатный: смета появится после того, как станет известен объём правок. Платите только за фактически
              исправленное.
            </span>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/app/onboarding')} style={{ marginTop: 'var(--space-3)' }}>
              Добавить сайт
            </button>
          </Blueprint>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-6)' }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--color-accent)', marginBottom: 6 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: MUTED }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
