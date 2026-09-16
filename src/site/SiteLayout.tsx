import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Menu, Phone, X } from 'lucide-react';
import { useIndustryDocument } from '@/design/industry';
import { SITE_CONTACTS } from '@/config/site-contacts';
import './site.css';

/**
 * Каркас публичного сайта SeoMarket: шапка и подвал из макета «SeoMarket Сайт.dc.html»
 * (строки 42–58 и 557–605), тема Industry — всегда светлая, как в макете.
 *
 * Ширина контента 1200px и поля clamp(20px,5vw,72px) — общие для всех страниц сайта: `SiteContainer`.
 */

export const SITE_GUTTER = 'clamp(20px,5vw,72px)';
export const MUTED = 'color-mix(in srgb,var(--color-text) 68%,transparent)';

export const SiteContainer: React.FC<{ children: React.ReactNode; max?: number; style?: React.CSSProperties }> = ({
  children,
  max = 1200,
  style,
}) => <div style={{ maxWidth: max, margin: '0 auto', paddingInline: SITE_GUTTER, ...style }}>{children}</div>;

const NAV: { to: string; label: string }[] = [
  { to: '/#uslugi', label: 'Услуги' },
  { to: '/#ceny', label: 'Цены' },
  { to: '/#metodika', label: 'Методика' },
  { to: '/blog', label: 'Блог' },
  { to: '/otzyvy', label: 'Отзывы' },
  { to: '/app', label: 'Войти' },
];

/**
 * Переход по якорю (/#ceny) с другой страницы. React Router меняет адрес, но не прокручивает:
 * секция появляется после отрисовки ленивой страницы, поэтому ищем её несколько кадров подряд.
 */
function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        // Якорь #audit ведёт к форме проверки — сразу ставим курсор в поле адреса.
        if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
        return;
      }
      if (tries++ < 60) raf = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
}

const Brand: React.FC = () => (
  <Link to="/" className="nav-brand" style={{ letterSpacing: '.04em', color: 'inherit', textDecoration: 'none' }}>
    SEOMARKET
  </Link>
);

const SiteHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => setOpen(false), [pathname, hash]);

  const current = (to: string) => (to.startsWith('/#') ? false : pathname === to || pathname.startsWith(`${to}/`));

  return (
    <nav
      className="nav"
      aria-label="Основное меню"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-divider)',
        paddingInline: SITE_GUTTER,
        gap: 'var(--space-6)',
        flexWrap: 'wrap',
      }}
    >
      <Brand />
      <div data-navlinks style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4) var(--space-6)', marginLeft: 'auto', minWidth: 0 }}>
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} aria-current={current(item.to) ? 'page' : undefined}>
            {item.label}
          </Link>
        ))}
      </div>
      <Link to="/#audit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
        Проверить сайт
      </Link>
      <button
        type="button"
        data-mobilemenu
        className="btn btn-secondary btn-icon"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
      </button>
      {/* Мобильное меню: в макете ниже 860px ссылки просто скрывались и оставался только подвал.
          Для рабочего сайта этого мало — без меню с телефона не дойти до блога и входа. */}
      {open && (
        <div style={{ flexBasis: '100%', display: 'grid', gap: 2, padding: '4px 0 10px' }}>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} style={{ padding: '9px 0', borderBottom: '1px solid var(--color-divider)', fontSize: 15 }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const FooterHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>{children}</span>
);

const SiteFooter: React.FC = () => {
  const c = SITE_CONTACTS;
  return (
    <footer style={{ borderTop: '1px solid var(--color-divider)', padding: '44px 0 56px', marginTop: 'auto' }}>
      <SiteContainer
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--space-8)' }}
      >
        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, letterSpacing: '.04em' }}>SEOMARKET</span>
          <span style={{ fontSize: 12.5, lineHeight: 1.5, color: MUTED, maxWidth: '30ch' }}>
            Аудит бесплатно, оплата за исправления. Работаем с сайтами на любой CMS.
          </span>
        </div>
        <div style={{ display: 'grid', gap: 8, alignContent: 'start', fontSize: 13.5 }}>
          <FooterHead>Продукт</FooterHead>
          <Link to="/#kak">Как это работает</Link>
          <Link to="/#uslugi">Услуги и цены за единицу</Link>
          <Link to="/#ceny">Цены</Link>
          <Link to="/#metodika">Методика оптимизации</Link>
          <Link to="/#proverki">Состав проверок</Link>
          <Link to="/app">Личный кабинет</Link>
        </div>
        <div style={{ display: 'grid', gap: 8, alignContent: 'start', fontSize: 13.5 }}>
          <FooterHead>Материалы</FooterHead>
          <Link to="/blog">Блог</Link>
          <Link to="/otzyvy">Отзывы</Link>
          <Link to="/#faq">Частые вопросы</Link>
          <Link to="/#organika">Органика вместо Директа</Link>
          <Link to="/about">О сервисе</Link>
          <Link to="/bezopasnost">Безопасность и доступы</Link>
          <Link to="/sitemap">Карта сайта</Link>
        </div>
        <div style={{ display: 'grid', gap: 8, alignContent: 'start', fontSize: 13.5 }}>
          <FooterHead>Контакты</FooterHead>
          {/* Только настоящие контакты из site-contacts.ts: пустое поле не показываем. */}
          {c.email && (
            <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifySelf: 'start' }}>
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
              {c.email}
            </a>
          )}
          {c.telephone && (
            <a href={`tel:${c.telephone.replace(/[^\d+]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifySelf: 'start' }}>
              <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
              {c.telephone}
            </a>
          )}
          <Link to="/contact">Контакты и реквизиты</Link>
          <Link to="/contact#zayavka">Оставить заявку</Link>
        </div>
      </SiteContainer>
      <SiteContainer
        style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: '1px solid var(--color-divider)',
          display: 'flex',
          gap: 'var(--space-6)',
          flexWrap: 'wrap',
          fontSize: 12,
          color: MUTED,
        }}
      >
        <span>© {new Date().getFullYear()} SeoMarket</span>
        <Link to="/oferta" style={{ color: 'inherit' }}>Оферта</Link>
        <Link to="/privacy" style={{ color: 'inherit' }}>Конфиденциальность</Link>
        <Link to="/cookie" style={{ color: 'inherit' }}>Cookie</Link>
        <Link to="/vozvrat" style={{ color: 'inherit' }}>Возврат и гарантии</Link>
      </SiteContainer>
    </footer>
  );
};

/** Корень страницы публичного сайта. */
export const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useIndustryDocument('light');
  useHashScroll();
  return (
    <div className="ds-site" style={{ display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
