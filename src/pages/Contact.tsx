import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import SocialLinks from '@/components/contact/SocialLinks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { SITE_CONTACTS, hasPostalAddress } from '@/config/site-contacts';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Страница контактов.
 *
 * Здесь были три карточки «Онлайн чат — Онлайн», «Техническая поддержка — 24/7»
 * и «Консультация — Бесплатно» с кнопками без обработчиков, кнопка «Открыть
 * чат», часы работы с субботними сменами и FAQ про круглосуточную поддержку и
 * главный офис в Москве. Чата нет, поддержки 24/7 нет, офиса нет, часы никто
 * не утверждал. Человек нажимал кнопки — и ничего не происходило.
 *
 * Теперь рабочий способ связи один — форма: обращение сохраняется в базе.
 * Телефон, почта и адрес появятся сами, когда их впишут в SITE_CONTACTS.
 */
const Contact: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const hasDirectContacts = Boolean(SITE_CONTACTS.telephone || SITE_CONTACTS.email);

  const faqs = [
    {
      question: "Куда придёт ответ на обращение?",
      answer: "На адрес электронной почты, который вы укажете в форме. Если вопрос срочный, напишите об этом в теме сообщения."
    },
    {
      question: "Помогаете ли вы разобраться с сервисом?",
      answer: "Да. Вопросы по аудиту, отчётам, оптимизации и проверке позиций присылайте через форму на этой странице."
    },
    {
      question: "Как проверить сайт до обращения?",
      answer: "Запустите аудит на странице «Аудит сайта» — отчёт по страницам покажет, какие ошибки нашлись. Ссылку на него можно приложить к сообщению."
    },
    {
      question: "Нужно ли куда-то приезжать?",
      answer: "Нет. Сервис работает онлайн: аудит, оптимизация и проверка позиций запускаются из браузера."
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Контакты: форма связи с командой SeoMarket"
        description="Напишите через форму — ответим на вопросы об аудите сайта, оптимизации, проверке позиций и стоимости работ. Обращение сохраняется и не теряется."
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Контакты', url: '/contact' }
      ]} />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Обратная связь
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              >
                Свяжитесь с нами
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Расскажите, что нужно сделать с сайтом, или задайте вопрос о сервисе.
                Обращение из формы сохраняется у нас, ответ придёт на указанную почту
              </motion.p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
              {/* Contact Form - Takes more space */}
              <motion.div
                id="contact-form"
                className={hasDirectContacts ? 'xl:col-span-3' : 'xl:col-span-5 max-w-3xl mx-auto w-full'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Отправить сообщение</h2>
                  <p className="text-muted-foreground">
                    Заполните форму ниже — мы ответим на email, который вы укажете
                  </p>
                </div>
                <ContactForm />
              </motion.div>

              {/*
                Боковая колонка: карточки телефона и почты, а также «Быстрая
                связь». Пока в SITE_CONTACTS пусто, колонки нет — иначе
                оставался пустой заголовок без единого способа связи.
              */}
              {hasDirectContacts && (
              <motion.div
                className="xl:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-8">
                  <ContactInfo />

                  {/* Quick Contact */}
                  <Card className="neo-card bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Быстрая связь</h3>
                      <div className="space-y-4">
                        {/*
                          Кнопки «Позвонить» и «Написать email» никуда не вели.
                          Теперь это настоящие ссылки на контакты из
                          SITE_CONTACTS, и без контакта кнопки просто нет.
                          Кнопку «Открыть чат» убрали: чата у сервиса нет.
                        */}
                        {SITE_CONTACTS.telephone && (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={`tel:${SITE_CONTACTS.telephone.replace(/[^+\d]/g, '')}`}>
                              <Phone className="w-4 h-4 mr-2" />
                              Позвонить сейчас
                            </a>
                          </Button>
                        )}
                        {SITE_CONTACTS.email && (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={`mailto:${SITE_CONTACTS.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Написать email
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
              )}
            </div>

            {/*
              Раздел «Наше местоположение» описывал офис, которого нет:
              «Москва, ул. Примерная, д. 123, БЦ "Технополис", офис 456» и
              станцию метро «Примерная». Людей звали приехать в никуда.
              Теперь весь блок показывается, только если в SITE_CONTACTS
              заполнен настоящий адрес. Заглушку «Интерактивная карта —
              Загружается...» убрали: карта там никогда не загружалась.
            */}
            {hasPostalAddress() && (
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Наше местоположение</h2>
                <p className="text-muted-foreground">
                  О личной встрече договоримся заранее — напишите через форму
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                <Card className="neo-card">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-primary mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Офис</h3>
                        <address className="not-italic text-muted-foreground leading-relaxed">
                          {SITE_CONTACTS.addressLocality}, {SITE_CONTACTS.streetAddress}
                        </address>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Кнопка «Записаться на встречу» ничего не делала — теперь ведёт к форме. */}
                <Button size="lg" className="w-full" asChild>
                  <a href="#contact-form">
                    <Calendar className="w-4 h-4 mr-2" />
                    Договориться о встрече
                  </a>
                </Button>
              </div>
            </motion.div>
            )}

            {/* Social Links */}
            <SocialLinks />

            {/* FAQ Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
                <p className="text-muted-foreground">
                  Коротко о том, как с нами связаться
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="neo-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
