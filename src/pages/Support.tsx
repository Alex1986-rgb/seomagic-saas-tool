import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';
import Layout from '@/components/Layout';
import { SITE_CONTACTS } from '@/config/site-contacts';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Страница поддержки.
 *
 * Раньше здесь были: поиск «по базе знаний» с кнопкой «Найти» без обработчика,
 * карточка «Онлайн чат — доступен 24/7 для премиум-тарифов, ответ до 5 минут»
 * с кнопкой «Начать чат», кнопки «Написать письмо», «Заказать звонок»,
 * «Показать больше вопросов» и «Связаться с поддержкой», которые ничего не
 * делали, вкладки FAQ без содержимого и ответы про бесплатный пробный период и
 * лимиты сайтов на «профессиональном» и «бизнес-тарифе». Чата, тарифов и
 * пробного периода нет, а обращение, начатое с этой страницы, терялось.
 *
 * Теперь каждая кнопка ведёт туда, где обращение действительно сохраняется, —
 * на форму связи, а почта и телефон появятся, когда их впишут в SITE_CONTACTS.
 */
const Support: React.FC = () => {
  const faqItems = [
    {
      question: "Как начать использовать SeoMarket?",
      answer: "Зарегистрируйтесь и запустите аудит, указав адрес сайта. Когда проверка закончится, отчёт по страницам появится в разделе аудитов. Пошаговые материалы — в разделе «Руководства»."
    },
    {
      question: "Что проверяет аудит?",
      answer: "Аудит обходит страницы сайта и по каждой проверяет код ответа, title и meta description, заголовки H1–H3, canonical и индексируемость, скорость ответа сервера, сжатие, изображения без alt и объём текста."
    },
    {
      question: "Как часто обновляются данные о позициях?",
      answer: "Позиции в Яндексе и Google снимаются, когда вы запускаете проверку в трекере. Проверок по расписанию и уведомлений об изменениях сейчас нет."
    },
    {
      question: "Можно ли выгрузить отчёт?",
      answer: "Да, результаты аудита можно скачать в PDF со страницы результатов. Автоматической рассылки отчётов на почту нет."
    },
    {
      question: "Сколько сайтов я могу проверять?",
      answer: "Тарифов и автоматических списаний сейчас нет: оплата на сайте не подключена. Если нужен большой объём работ или счёт — напишите нам через форму связи."
    },
    {
      question: "Где найти прошлые проверки?",
      answer: "Запущенные аудиты сохраняются в разделе «Аудиты» личного кабинета — можно открыть прошлую проверку и сравнить результаты."
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Поддержка пользователей: помощь и ответы на вопросы"
        description="Как связаться с командой сервиса и получить ответ на вопрос об аудите, позициях или оптимизации. Ниже — частые вопросы."
      />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Поддержка</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ответы на частые вопросы и способы связаться с нами по работе с платформой
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <Card className="neo-card w-full md:max-w-sm">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Форма обратной связи</CardTitle>
                <CardDescription>Опишите вопрос или проблему</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Обращение сохраняется у нас, ответ придёт на почту, которую вы укажете.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/contact">Написать нам</Link>
                </Button>
              </CardFooter>
            </Card>

            {SITE_CONTACTS.email && (
              <Card className="neo-card w-full md:max-w-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>Email поддержка</CardTitle>
                  <CardDescription>Напишите нам о вашем вопросе</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Отправьте подробное описание проблемы и адрес сайта, если вопрос о проверке.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${SITE_CONTACTS.email}`}>Написать письмо</a>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/*
              Карточка обещала телефонную поддержку по номеру
              +7 (800) 123-45-67 — этого номера не существует, но люди по нему
              звонили. Пока в SITE_CONTACTS нет настоящего телефона, обещать
              телефонную поддержку нечем, поэтому карточки нет. Часы работы и
              кнопку «Заказать звонок» без обработчика тоже убрали.
            */}
            {SITE_CONTACTS.telephone && (
              <Card className="neo-card w-full md:max-w-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <Phone className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>Телефонная поддержка</CardTitle>
                  <CardDescription>Поговорите с нашими специалистами</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <a
                    href={`tel:${SITE_CONTACTS.telephone.replace(/[^+\d]/g, '')}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {SITE_CONTACTS.telephone}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Часто задаваемые вопросы</h2>
              <p className="text-muted-foreground mt-2">Быстрые ответы на распространенные вопросы</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/faq">Все вопросы и ответы</Link>
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Напишите через форму связи — опишите вопрос, и мы ответим на вашу почту
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Связаться с поддержкой</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
