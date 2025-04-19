
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-lg font-medium">
              Что такое SeoMarket и как он может помочь моему сайту?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                SeoMarket — это комплексная платформа для SEO-аудита и оптимизации сайтов. Наш сервис помогает выявить технические проблемы, недостатки контента и другие факторы, которые могут негативно влиять на позиции вашего сайта в поисковых системах. После анализа мы предлагаем конкретные рекомендации и инструменты для улучшения SEO-показателей, что в итоге помогает повысить видимость сайта и увеличить органический трафик.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-lg font-medium">
              Сколько времени занимает полный SEO-аудит сайта?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Время аудита зависит от размера и сложности сайта. Для небольших сайтов (до 100 страниц) базовый аудит обычно занимает 5-15 минут. Для средних сайтов (100-1000 страниц) — 15-30 минут. Для крупных сайтов (более 1000 страниц) аудит может занять от 30 минут до нескольких часов. Глубокий аудит с подробным анализом всех страниц может занять больше времени. Наша система оптимизирована для максимально быстрого анализа без потери качества результатов.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-lg font-medium">
              Какие ошибки и проблемы может выявить SeoMarket?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                SeoMarket выявляет широкий спектр SEO-проблем, включая:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Технические проблемы (битые ссылки, ошибки в robots.txt, проблемы с XML-картой сайта, медленная загрузка страниц)</li>
                <li>Проблемы мета-данных (отсутствующие или дублирующиеся title и description, неоптимальные заголовки H1-H6)</li>
                <li>Проблемы контента (тонкий контент, дублированный контент, низкая уникальность)</li>
                <li>Проблемы с изображениями (отсутствие атрибутов alt, большой размер файлов)</li>
                <li>Проблемы структуры сайта (слишком глубокая вложенность страниц, неоптимальная внутренняя перелинковка)</li>
                <li>Проблемы с мобильной версией сайта</li>
                <li>Проблемы с индексацией и видимостью в поисковых системах</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-lg font-medium">
              Может ли SeoMarket автоматически исправить обнаруженные проблемы?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Да, SeoMarket предлагает функцию автоматической оптимизации, которая может исправить многие обнаруженные проблемы. Система может автоматически:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Оптимизировать мета-теги (title, description)</li>
                <li>Улучшить заголовки страниц</li>
                <li>Обновить атрибуты alt для изображений</li>
                <li>Создать или исправить файл robots.txt</li>
                <li>Сгенерировать XML-карту сайта</li>
                <li>Улучшить внутреннюю перелинковку</li>
                <li>Предложить рекомендации по улучшению контента</li>
              </ul>
              <p className="mt-2">
                Некоторые более сложные проблемы, особенно связанные с серверной частью или уникальным контентом, могут требовать ручного вмешательства, но наша система предоставит подробные инструкции по их исправлению.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left text-lg font-medium">
              Как часто рекомендуется проводить SEO-аудит сайта?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Частота проведения SEO-аудита зависит от нескольких факторов:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Для активно развивающихся сайтов:</strong> рекомендуется проводить базовый аудит ежемесячно, а полный глубокий аудит — раз в квартал.</li>
                <li><strong>Для стабильных сайтов:</strong> достаточно проводить базовый аудит раз в квартал, полный — раз в полгода.</li>
                <li><strong>После значительных изменений на сайте</strong> (редизайн, добавление новых разделов, смена CMS) настоятельно рекомендуется провести полный аудит.</li>
              </ul>
              <p className="mt-2">
                Также рекомендуется проводить экспресс-аудиты после любых существенных изменений в алгоритмах поисковых систем или при заметном падении позиций и трафика.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left text-lg font-medium">
              Как происходит оплата и какие есть тарифные планы?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                SeoMarket предлагает несколько гибких тарифных планов:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Бесплатный план:</strong> базовый аудит до 100 страниц, ограниченный набор инструментов.</li>
                <li><strong>Базовый план:</strong> аудит до 500 страниц, основные инструменты оптимизации, отслеживание до 10 ключевых слов.</li>
                <li><strong>Профессиональный план:</strong> аудит до 2000 страниц, полный набор инструментов, отслеживание до 50 ключевых слов, приоритетная поддержка.</li>
                <li><strong>Корпоративный план:</strong> неограниченное количество страниц, полный функционал, отслеживание до 200 ключевых слов, персональный менеджер.</li>
              </ul>
              <p className="mt-2">
                Оплата производится ежемесячно или ежегодно (со скидкой) через безопасные платежные системы. Мы принимаем кредитные карты, PayPal и, в некоторых странах, банковские переводы. Для корпоративных клиентов доступна оплата по счету.
              </p>
              <p className="mt-2">
                Все новые пользователи получают 14-дневный пробный период для профессионального плана, чтобы оценить возможности сервиса в полном объеме.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left text-lg font-medium">
              Как SeoMarket защищает мои данные и информацию о сайте?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Безопасность данных наших клиентов — абсолютный приоритет для SeoMarket. Мы применяем следующие меры для защиты вашей информации:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Все соединения защищены протоколом HTTPS с современным шифрованием.</li>
                <li>Данные пользователей хранятся в защищенных облачных хранилищах с многоуровневой системой безопасности.</li>
                <li>Доступ к данным предоставляется только авторизованным пользователям.</li>
                <li>Мы не продаем и не передаем информацию о клиентах третьим лицам.</li>
                <li>Регулярное резервное копирование для предотвращения потери данных.</li>
                <li>Автоматическое удаление устаревших данных согласно политике конфиденциальности.</li>
              </ul>
              <p className="mt-2">
                Наша политика конфиденциальности полностью соответствует GDPR и другим международным стандартам защиты данных. С подробной информацией вы можете ознакомиться в разделе «Политика конфиденциальности» нашего сайта.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left text-lg font-medium">
              Какая поддержка предоставляется пользователям SeoMarket?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Мы предоставляем несколько уровней поддержки для наших пользователей:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Документация и база знаний:</strong> подробные руководства, видеоуроки и ответы на часто задаваемые вопросы.</li>
                <li><strong>Email-поддержка:</strong> доступна для всех пользователей с гарантированным ответом в течение 24-48 часов.</li>
                <li><strong>Чат-поддержка:</strong> доступна пользователям Базового и более высоких планов в рабочие часы.</li>
                <li><strong>Приоритетная поддержка:</strong> для пользователей Профессионального и Корпоративного планов с временем ответа до 4 часов.</li>
                <li><strong>Персональный менеджер:</strong> для клиентов Корпоративного плана.</li>
                <li><strong>Вебинары и обучение:</strong> регулярные онлайн-семинары по SEO и использованию платформы.</li>
              </ul>
              <p className="mt-2">
                Наша команда поддержки состоит из квалифицированных специалистов по SEO, которые могут не только помочь с использованием платформы, но и дать профессиональные рекомендации по оптимизации вашего сайта.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-12 p-4 bg-primary/10 border border-primary/30 rounded-md text-center">
          <p className="font-medium">Не нашли ответ на свой вопрос?</p>
          <p className="mt-2">
            Свяжитесь с нашей службой поддержки по адресу <a href="mailto:support@seomarket.ru" className="text-primary underline">support@seomarket.ru</a> или воспользуйтесь <a href="/contact" className="text-primary underline">формой обратной связи</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
