import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp, SquareCheck } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { MUTED, SiteContainer, SiteLayout } from '@/site/SiteLayout';
import { SitePhoto } from '@/site/SitePhoto';
import { ARTICLES } from '@/site/blog/articles';
import { ArticleMetaLine } from '@/site/blog/ArticleMetaLine';
import { ArticleRail } from '@/site/blog/ArticleRail';
import '@/site/blog/blog.css';

/**
 * Лента блога — макет «SeoMarket Блог.dc.html».
 *
 * Из макета сознательно убрано: «кейс» каталога мебели с 3 412 страницами, «214 проверок»,
 * «сорок тысяч адресов», «свыше 6 % — фильтр», «меньше 300 слов не попадает в индекс»,
 * «мы отправляем в индекс все три способа» и «восстанавливаем 90 дней». Ни одно из этого не
 * подтверждается ни нормами поисковиков, ни кодом сервиса. Тексты заменены проверяемыми.
 */

const SOFT = 'color-mix(in srgb,var(--color-text) 80%,transparent)';
const CELL = 'color-mix(in srgb,var(--color-text) 78%,transparent)';

const [featured, ...rest] = ARTICLES;

/** Проверки, которые владелец сайта делает сам — строки таблицы «Что проверить самому». */
const SELF_CHECKS: { what: string; mono?: boolean; look: string; means: string; hl?: boolean }[] = [
  { what: '/robots.txt', mono: true, look: 'Строку Disallow: / под User-agent: *', means: 'Сайт полностью закрыт от обхода — остальное не имеет значения' },
  { what: '/sitemap.xml', mono: true, look: 'Даты изменения и адреса из карты', means: 'Нет новых разделов или все даты одинаковые — карта не помогает роботу' },
  { what: 'Исходный код пяти страниц', look: 'Теги title и description, число H1', means: 'Одинаковые title на разных страницах мешают поисковику их различать', hl: true },
  { what: 'Поиск по сайту в Яндексе', look: 'Число найденных страниц против числа товаров', means: 'Найдено намного больше, чем товаров и категорий, — вероятны дубли' },
  { what: 'Категория с фильтром', look: 'Тег canonical в коде', means: 'Нет canonical — страницы с фильтрами и сортировкой спорят с основной' },
  { what: 'Мобильная версия листинга', look: 'Сдвиг карточек после загрузки баннера', means: 'Прыгающая вёрстка — показатель CLS, скорее всего, выше нормы 0,1' },
];

/**
 * «Симптом и причина». Последняя колонка в макете — «правится сама», но автоматической установки
 * правок в сервисе нет. Честная колонка — находит ли это наш аудит (по issue-classifier).
 */
const SYMPTOMS: { symptom: string; cause: string; found: 'Да' | 'Частично' | 'Нет' }[] = [
  { symptom: 'Страниц в индексе меньше, чем товаров', cause: 'Глубокие страницы в изоляции, до них редко доходит обход', found: 'Частично' },
  { symptom: 'Страниц в индексе заметно больше', cause: 'Дубли с параметрами, нет canonical', found: 'Да' },
  { symptom: 'Позиции резко упали разом', cause: 'Noindex, попавший на сайт с обновлением, пропавший canonical или ошибки сервера', found: 'Да' },
  { symptom: 'В сниппете случайный текст', cause: 'Пустой или слишком длинный description', found: 'Да' },
  { symptom: 'Категории не ранжируются', cause: 'Мало полезного текста, страница похожа на соседние', found: 'Частично' },
  { symptom: 'Трафик есть, заявок нет', cause: 'Запросы информационные, а не коммерческие — вопрос семантики', found: 'Нет' },
];

/** Ответы повторяют обещания лендинга и кабинета: аудит бесплатный, оплата за выбранные строки сметы. */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Сколько ждать результата после правок',
    a: 'Столько, сколько роботу нужно, чтобы переобойти исправленные страницы: главные разделы обычно быстрее, глубокие карточки дольше. Технические правки вроде canonical и редиректов учитываются раньше, чем изменения текстов.',
  },
  {
    q: 'Можно исправить только часть найденного',
    a: 'Да. В смете отмечаются нужные строки, сумма пересчитывается. Что критично для индексации, видно по важности находки, но брать это в работу никто не обязывает.',
  },
  {
    q: 'Тексты пишет нейросеть — это не спам?',
    a: 'Черновики мета-тегов и рекомендации по тексту готовит языковая модель по данным конкретной страницы. Их нужно вычитывать: цены, сроки и условия модель знать не может и не должна придумывать.',
  },
  {
    q: 'Что если правки затрёт обновление CMS',
    a: 'Такое случается часто. Повторный аудит бесплатный: запустите его после обновления и сравните находки с прошлым отчётом — затёртые правки сразу будут видны по адресам.',
  },
];

const BlogIndex: React.FC = () => (
  <SiteLayout>
    <PageSeo
      title="Блог о техническом SEO"
      description="Как поисковики читают сайт: дубли, скорость, robots.txt, микроразметка, перелинковка и цена SEO. Нормы с источниками и проверки, которые можно сделать самому."
    />
    <SiteContainer>
      <section style={{ padding: '72px 0 48px', maxWidth: '74ch' }}>
        <span style={{ display: 'block', fontSize: 13, lineHeight: '12px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-accent-700)', margin: '0 0 14px' }}>
          Блог
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(34px,5vw,64px)', lineHeight: 1.06, letterSpacing: '.01em', textTransform: 'uppercase', margin: '0 0 20px', overflowWrap: 'anywhere' }}>
          Как поисковики читают сайт
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, color: SOFT }}>
          Разбираем технические причины, по которым сайт не растёт в органике: дубли, переспам, изоляция глубоких страниц, медленный шаблон каталога. Без общих советов — с нормами поисковиков и проверками, которые можно сделать самому.
        </p>
      </section>

      {/* Главная статья отдельным блоком, а не первой карточкой сетки: у блога должна быть точка
          входа для тех, кто пришёл впервые и не знает, с чего начать. */}
      <section style={{ padding: '0 0 64px' }}>
        <article id={featured.slug} data-blogcard style={{ position: 'relative', display: 'grid', gap: 'clamp(24px,3vw,44px)', scrollMarginTop: 88 }}>
          <div data-two style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', alignItems: 'start', gap: 'clamp(16px,2vw,24px)' }}>
            <SitePhoto id={featured.photo} aspect="16/9" eager />
            {featured.photoDetail && <SitePhoto id={featured.photoDetail} aspect="4/5" eager />}
          </div>
          <div style={{ maxWidth: '76ch' }}>
            <ArticleMetaLine article={featured} withYear style={{ marginBottom: 12 }} />
            <h2 data-cardtitle style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,3.4vw,42px)', lineHeight: 1.1, letterSpacing: '.02em', textTransform: 'uppercase', margin: '0 0 14px', overflowWrap: 'anywhere' }}>
              <Link to={`/blog/${featured.slug}`} data-stretched>
                {featured.title}
              </Link>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: '0 0 16px', color: SOFT }}>{featured.lead}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 13.5, color: 'var(--color-accent-700)' }}>
              Читать статью
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
        </article>
      </section>

      <hr style={{ height: 1, border: 0, margin: '0 0 56px', background: 'var(--color-divider)' }} />

      {/* Остальные статьи. У каждой два кадра — обложка и деталь, как в макете.
          id карточки = slug: старые якоря /blog#dubli продолжают вести к нужной статье. */}
      <section data-two style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(32px,4vw,64px)', paddingBottom: 64 }}>
        {rest.map((a) => (
          <article key={a.slug} id={a.slug} data-post data-blogcard style={{ minWidth: 0, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', alignItems: 'start', gap: 12, marginBottom: 20 }}>
              <SitePhoto id={a.photo} aspect="4/3" />
              {a.photoDetail && <SitePhoto id={a.photoDetail} aspect="1/1" />}
            </div>
            <ArticleMetaLine article={a} style={{ marginBottom: 10 }} />
            <h2 data-cardtitle style={{ fontFamily: 'var(--font-heading)', fontSize: 26, lineHeight: 1.15, letterSpacing: '.02em', textTransform: 'uppercase', margin: '0 0 12px', overflowWrap: 'anywhere' }}>
              <Link to={`/blog/${a.slug}`} data-stretched>
                {a.title}
              </Link>
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: '0 0 14px', color: SOFT }}>{a.lead}</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: '0 0 16px', color: SOFT }}>{a.summary}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 13.5, color: 'var(--color-accent-700)' }}>
              Читать статью
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </article>
        ))}

        <article id="podpiska" className="blueprint" style={{ minWidth: 0, padding: 'clamp(24px,3vw,40px)', display: 'grid', gap: 'var(--space-4)', alignContent: 'center' }}>
          <i className="corner tl" />
          <i className="corner tr" />
          <i className="corner bl" />
          <i className="corner br" />
          <span style={{ fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Вместо подписки</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, lineHeight: 1.15, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0 }}>
            Проверьте свой сайт по этим же нормам
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: SOFT }}>
            Многое из того, о чём написано в статьях, аудит проверяет автоматически: мета-теги, canonical, коды ответа и редиректы, время ответа сервера, сжатие и объём текста. Отчёт — с адресами страниц, смета — по найденному объёму. Аудит бесплатный, карта не нужна.
          </p>
          <Link to="/#audit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
            Запустить аудит
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <hr style={{ height: 1, border: 0, margin: '0 0 56px', background: 'var(--color-divider)' }} />

      {/* Сводка проверок внизу страницы: поисковику — содержательный текст по теме блога,
          читателю — нормы в одном месте. */}
      <section style={{ paddingBottom: 56 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,3.2vw,38px)', lineHeight: 1.1, letterSpacing: '.02em', textTransform: 'uppercase', margin: '0 0 20px' }}>
          Что проверить самому перед заказом аудита
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: '74ch', margin: '0 0 32px', color: SOFT }}>
          Часть проблем из статей выше видно без инструментов — достаточно открыть два файла и посмотреть исходный код нескольких страниц. Ниже сводка: что открыть, что искать и что это значит. Если проверки проходят, а поиска всё равно нет, причина глубже и нужен обход всего сайта.
        </p>

        <p style={{ textAlign: 'center', fontSize: 15, margin: '0 0 12px', color: CELL }}>Проверки, которые делаются вручную за десять минут</p>
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)', marginBottom: 44 }} tabIndex={0} role="region" aria-label="Проверки, которые делаются вручную">
          <table className="table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '24%', paddingLeft: 24 }}>Что открыть</th>
                <th scope="col">Что искать</th>
                <th scope="col">Что значит находка</th>
              </tr>
            </thead>
            <tbody>
              {SELF_CHECKS.map((row) => (
                <tr key={row.what} data-hl={row.hl ? '' : undefined}>
                  <td style={{ paddingLeft: 24, fontSize: 15, fontFamily: row.mono ? 'var(--font-mono)' : undefined, fontWeight: row.hl ? 600 : undefined }}>
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <SquareCheck size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 3, color: 'var(--color-accent)' }} />
                      <span>{row.what}</span>
                    </span>
                  </td>
                  <td style={{ fontSize: 14, color: CELL }}>{row.look}</td>
                  <td style={{ fontSize: 14, color: CELL }}>{row.means}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: 'center', fontSize: 15, margin: '0 0 12px', color: CELL }}>Симптом и причина: с чем чаще всего приходят</p>
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }} tabIndex={0} role="region" aria-label="Симптом и причина">
          <table className="table" style={{ minWidth: 780 }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '28%', paddingLeft: 24 }}>Симптом</th>
                <th scope="col">Обычная причина</th>
                <th scope="col" style={{ textAlign: 'right' }}>Находит аудит</th>
              </tr>
            </thead>
            <tbody>
              {SYMPTOMS.map((row) => (
                <tr key={row.symptom}>
                  <td style={{ paddingLeft: 24, fontSize: 15 }}>{row.symptom}</td>
                  <td style={{ fontSize: 14, color: CELL }}>{row.cause}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`tag ${row.found === 'Да' ? 'tag-accent' : 'tag-outline'}`}>{row.found}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, margin: '14px 0 0', color: MUTED }}>
          «Частично» — аудит видит признаки (страницы без внутренних ссылок, тонкий контент), но не знает, какие страницы в индексе: это видно только в Яндекс Вебмастере и Search Console.
        </p>
      </section>

      {/* FAQ: вопросы, которые задают до заказа. Обещания — те же, что на лендинге и в кабинете. */}
      <section style={{ paddingBottom: 56 }}>
        <span style={{ display: 'block', fontSize: 13, lineHeight: '12px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-accent-700)', margin: '0 0 12px' }}>
          Частые вопросы
        </span>
        <hr style={{ height: 1, border: 0, margin: '0 0 36px', background: 'var(--color-divider)' }} />
        <div data-two style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 'clamp(28px,3.5vw,56px)' }}>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontFamily: 'var(--font-heading)', fontSize: 20, letterSpacing: '.02em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                <CircleHelp size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 1, color: 'var(--color-accent)' }} />
                <span>{item.q}</span>
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: SOFT }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ paddingBottom: 88 }}>
        <ArticleRail />
      </section>
    </SiteContainer>
  </SiteLayout>
);

export default BlogIndex;
