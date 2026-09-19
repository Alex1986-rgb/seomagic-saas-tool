import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Blueprint, Kicker, MUTED, NotConnected, Seg } from '../ui';
import { hostOf } from '../format';
import { AccentNote, FormError } from '../account/parts';
import {
  MAX_TRACKER_KEYWORDS,
  REGIONS,
  type RegionId,
  auditLink,
  normalizeSiteUrl,
  parseKeywords,
  positionsLink,
} from '../account/helpers';

/**
 * «Добавить сайт» — три шага (макет, строки 1785–1850; логика OB/ob/obNext — 3171–3186).
 *
 * Таблицы проектов и подтверждения прав в базе нет: проект в кабинете — это хост из аудитов
 * пользователя (src/cabinet/project.tsx). Поэтому мастер ничего не сохраняет. Сайт становится
 * проектом, когда по нему запущен первый аудит, — туда и ведёт последний шаг
 * (/app/audit?url=…). Запросы для трекера передаются в «Позиции» параметрами адреса.
 */

type Step = 1 | 2 | 3;

const STEPS: Record<Step, { label: string; title: string; tile: string }> = {
  1: { label: 'Шаг 1 из 3', title: 'Адрес и регион', tile: 'Адрес и регион' },
  2: { label: 'Шаг 2 из 3', title: 'Подтвердите права на домен', tile: 'Подтверждение прав' },
  3: { label: 'Шаг 3 из 3', title: 'Запросы для трекера', tile: 'Запросы для трекера' },
};

const VERIFY = [
  { value: 'meta', label: 'Мета-тег в <head> главной страницы' },
  { value: 'file', label: 'Файл на сервере' },
  { value: 'dns', label: 'DNS-запись TXT' },
  { value: 'webmaster', label: 'Через Яндекс Вебмастер' },
] as const;

type SiteType = 'shop' | 'services' | 'media';

const ON = 'var(--color-accent)';
const OFF = 'color-mix(in srgb,var(--color-text) 14%,transparent)';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [address, setAddress] = useState('');
  const [touched, setTouched] = useState(false);
  const [region, setRegion] = useState<RegionId>('msk');
  const [siteType, setSiteType] = useState<SiteType>('shop');
  const [verify, setVerify] = useState<(typeof VERIFY)[number]['value']>('meta');
  const [keywordsText, setKeywordsText] = useState('');

  const siteUrl = useMemo(() => normalizeSiteUrl(address), [address]);
  const keywords = useMemo(() => parseKeywords(keywordsText), [keywordsText]);
  const tooMany = keywords.length > MAX_TRACKER_KEYWORDS;

  // Вперёд — только с разборчивым адресом: шаги 2 и 3 без сайта бессмысленны, а аудит
  // по неразобранному адресу всё равно отклонит сервер. Назад — всегда.
  const goTo = (next: Step) => {
    if (next > 1 && !siteUrl) {
      setTouched(true);
      setStep(1);
      return;
    }
    setStep(next);
  };

  const s = STEPS[step];
  const cta = step < 3 ? 'Продолжить' : 'Запустить первый аудит';

  const primary = () => {
    if (step < 3) goTo((step + 1) as Step);
    else if (siteUrl) navigate(auditLink(siteUrl));
    else goTo(1);
  };

  return (
    <div data-screen style={{ maxWidth: 720, display: 'grid', gap: 'var(--space-8)', minWidth: 0 }}>
      <div>
        <Link to="/app" style={{ fontSize: 13 }}>
          ← К проектам
        </Link>
        <h1 style={{ fontSize: 36, margin: 'var(--space-3) 0 4px' }}>Добавить сайт</h1>
        {/* В макете «первый аудит запустится сразу после подтверждения прав». Проверки прав нет,
            проект появляется с первым аудитом — так и пишем. */}
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
          Три шага, около двух минут. Сайт появится в списке проектов после первого аудита — он бесплатный.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }} aria-label={s.label}>
        {([1, 2, 3] as Step[]).map((n) => (
          <span key={n} style={{ flex: 1, height: 3, transition: 'background .2s ease', background: step >= n ? ON : OFF }} />
        ))}
      </div>

      {/* Поле 32px как в макете; на телефоне сужается, иначе сегменты не влезают в 375px. */}
      <Blueprint style={{ padding: 'clamp(16px, 5vw, var(--space-8))', display: 'grid', gap: 'var(--space-6)', minWidth: 0 }}>
        <div>
          <Kicker>{s.label}</Kicker>
          <h2 style={{ fontSize: 24, margin: 'var(--space-2) 0 0' }}>{s.title}</h2>
        </div>

        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="ob1">Адрес сайта</label>
          <input
            id="ob1"
            className="input"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="https://example.ru"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setTouched(true)}
            style={{ minHeight: 42, fontSize: 15 }}
          />
        </div>
        {touched && address.trim() !== '' && !siteUrl && (
          <FormError>Не получается разобрать адрес. Укажите домен сайта, например example.ru или https://example.ru.</FormError>
        )}
        {touched && address.trim() === '' && step === 1 && <FormError>Укажите адрес сайта.</FormError>}

        {step === 1 && (
          <>
            {/* Регион не сохраняется (проектов в базе нет) — он уходит в «Позиции» номером региона
                Яндекса вместе с запросами шага 3. */}
            <div className="field" style={{ margin: 0 }}>
              <label>Регион продвижения</label>
              <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Seg name="obr" value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r.value, label: r.label }))} />
              </div>
            </div>
            {/* Тип сайта из макета оставлен в раскладке, но набор проверок аудита от него пока не
                зависит — обещание «для магазина добавятся карточки и Product» было бы неправдой. */}
            <div className="field" style={{ margin: 0 }}>
              <label>Тип сайта</label>
              <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Seg
                  name="obt"
                  value={siteType}
                  onChange={setSiteType}
                  options={[
                    { value: 'shop', label: 'Интернет-магазин' },
                    { value: 'services', label: 'Услуги' },
                    { value: 'media', label: 'Медиа' },
                  ]}
                />
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
              Пока аудит одинаковый для всех типов сайтов: отдельные проверки для магазинов (карточки, фильтры, разметка Product)
              не подключены.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            {/* Предупреждение о защите от ботов — до первого аудита: если разрешить обход после
                запуска, первый проход оборвётся и его придётся повторять. */}
            <AccentNote>
              Перед первым аудитом проверьте, не режет ли хостинг или Cloudflare запросы роботов — иначе обход оборвётся. Чем
              представляется наш обходчик, написано в <Link to="/app/settings">настройках проекта</Link>.
            </AccentNote>
            <div className="field" style={{ margin: 0 }}>
              <label>Способ подтверждения</label>
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                {VERIFY.map((v) => (
                  <label key={v.value} className="radio">
                    <input type="radio" name="verify" checked={verify === v.value} onChange={() => setVerify(v.value)} />
                    <span className="dot" />
                    {v.label}
                  </label>
                ))}
              </div>
            </div>
            {/* Мета-тега с кодом здесь нет: код подтверждения должен выдавать и проверять сервер.
                Показать придуманный код — значит попросить клиента поставить на сайт то, что никто
                не проверит. */}
            <NotConnected
              title="Проверка прав на домен"
              needs={[
                'таблица проектов с кодом подтверждения на каждый домен',
                'серверная функция, которая ищет код в мета-теге, файле или TXT-записи',
                'связь с Яндекс Вебмастером для четвёртого способа',
              ]}
            >
              Сейчас права не проверяются: аудит открытых страниц сайта запускается без подтверждения. Шаг можно пройти дальше.
            </NotConnected>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="ob3">Запросы для трекера, по одному в строке</label>
              <textarea
                id="ob3"
                className="input"
                style={{ minHeight: 120 }}
                placeholder="купить стройматериалы в москве"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
              />
            </div>
            {tooMany && (
              <FormError>
                За одну проверку позиций принимается не больше {MAX_TRACKER_KEYWORDS} запросов, у вас {keywords.length}. Лишние
                не уйдут в трекер.
              </FormError>
            )}
            {/* Автоподбора 30 запросов по контенту, как в макете, нет — не обещаем. */}
            <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
              Можно пропустить: запросы добавляются и позже, на экране «Позиции».
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={primary}>
            {cta}
          </button>
          {step === 3 && keywords.length > 0 && siteUrl && (
            <button type="button" className="btn btn-secondary" onClick={() => navigate(positionsLink(hostOf(siteUrl), keywords, region))}>
              Проверить позиции по запросам
            </button>
          )}
          {step === 3 && siteUrl && (
            <button type="button" className="btn btn-ghost" onClick={() => navigate(auditLink(siteUrl))}>
              Пропустить
            </button>
          )}
        </div>
      </Blueprint>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'var(--space-4)' }}>
        {([1, 2, 3] as Step[]).map((n) => (
          <button
            key={n}
            type="button"
            aria-current={step === n ? 'step' : undefined}
            onClick={() => goTo(n)}
            style={{
              textAlign: 'left',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              cursor: 'pointer',
              padding: 'var(--space-3)',
              transition: 'border-color .15s ease',
              border: `1px solid ${step === n ? ON : 'var(--color-divider)'}`,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 3 }}>Шаг {n}</div>
            <div style={{ fontSize: 14 }}>{STEPS[n].tile}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
