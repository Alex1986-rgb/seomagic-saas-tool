import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Blueprint, CheckButton } from './parts';

/** Последний экран: то же обещание, что под формой в герое, — без расхождений в лимитах. */
export const FinalCta: React.FC = () => (
  <section style={{ padding: '48px 0 88px' }}>
    <Blueprint
      style={{
        padding: 'clamp(28px,4vw,56px)',
        display: 'grid',
        gap: 'var(--space-4)',
        justifyItems: 'start',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(26px,3.2vw,38px)',
          lineHeight: 1.12,
          letterSpacing: '.02em',
          textTransform: 'uppercase',
          margin: 0,
          maxWidth: '24ch',
        }}
      >
        Начните с бесплатной проверки
      </h2>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '56ch',
          color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
        }}
      >
        Без регистрации и без карты: быструю проверку до 10 страниц покажем прямо на этой странице. Полный аудит до 300 страниц,
        отчёт и смета живут в кабинете — для них нужен аккаунт.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginTop: 'var(--space-2)',
        }}
      >
        <CheckButton>Проверить сайт</CheckButton>
        <Link to="/app" className="btn btn-secondary">
          <LogIn size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
          Войти в кабинет
        </Link>
      </div>
    </Blueprint>
  </section>
);
