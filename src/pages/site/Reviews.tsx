import React from 'react';
import { ArticleRail } from '@/site/blog/ArticleRail';
import { PageSeo } from '@/components/seo/PageSeo';
import { SiteContainer, SiteLayout } from '@/site/SiteLayout';
import { Kicker, Rule, SOFT } from '@/site/reviews/parts';
import { HowWePublish } from '@/site/reviews/HowWePublish';
import { ContractorCheck } from '@/site/reviews/ContractorCheck';
import { ReviewsCta, ReviewsFaq } from '@/site/reviews/FaqAndCta';

/**
 * «Отзывы» (/otzyvy) по макету design/seomarket-v2/SeoMarket Отзывы.dc.html.
 *
 * Порядок секций макета сохранён: шапка → (показатели) → отзывы → «Как проверить подрядчика» → FAQ →
 * призыв → карусель статей. Не перенесены выдуманные данные:
 * — плитки «418 заказов / балл 87 / 6 % отказов / 34 % вернулись»: заказов с оплатой нет, публичного
 *   безопасного источника таких чисел в базе нет, а нули на витрине вводили бы в заблуждение не меньше;
 * — шесть отзывов с именами, компаниями, номерами заказов и суммами — вместо них правила публикации
 *   и карточка-шаблон без данных (см. HowWePublish).
 * Разметки schema.org/Review на странице нет намеренно: отзывов нет, размечать нечего.
 * Карусель статей (ArticleRail) не подключена: её компонент делает исполнитель блога — вставить
 * последней секцией, когда появится src/site/blog/ArticleRail.
 */
const Reviews: React.FC = () => (
  <SiteLayout>
    <PageSeo
      title="Отзывы: как мы их публикуем и проверяем"
      description="Отзывов пока нет — сервис запускается. Публикуем только по завершённым заказам, с согласия клиента, с номером заказа и баллом аудита до и после. Как проверить SEO-подрядчика."
    />
    <SiteContainer>
      <section style={{ padding: '72px 0 44px', maxWidth: '74ch' }}>
        <Kicker>Отзывы</Kicker>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'clamp(34px,5vw,64px)',
            lineHeight: 1.06,
            letterSpacing: '.01em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          Что говорят о работе
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, color: SOFT }}>
          Отзывы будут появляться после приёмки работ — только от тех, кто дошёл до установки правок на сайт. Рядом с каждым
          будет объём заказа и балл аудита до и после: цифры из отчётов, а не со слов.
        </p>
      </section>

      <Rule />
      <HowWePublish />
      <Rule />
      <ContractorCheck />
      <ReviewsFaq />
      <ReviewsCta />
      {/* Карусель статей последней секцией, как в макете: после призыва читателю, который ещё не готов
          проверять сайт, нужен следующий шаг — материалы блога. */}
      <div style={{ paddingBottom: 88 }}>
        <ArticleRail />
      </div>
    </SiteContainer>
  </SiteLayout>
);

export default Reviews;
