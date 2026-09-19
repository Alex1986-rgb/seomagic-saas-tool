import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, CheckCircle, Server, Key, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SITE_CONTACTS } from '@/config/site-contacts';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Безопасность данных.
 *
 * Страница заявляла сертификаты, которых у сервиса нет: GDPR, ISO 27001,
 * SOC 2 Type II и 152-ФЗ со значками «Сертифицирован» и «Действующий
 * сертификат». Ещё обещались шифрование AES-256, многофакторная
 * аутентификация, изолированные серверы, сроки хранения («1 год», «2 года»),
 * которые нигде не заданы, «время ответа в течение 24 часов» и «данные не
 * передаются внешним организациям» — хотя для подготовки текстов данные
 * страниц уходят языковой модели, а для проверки позиций запросы уходят
 * поставщику поисковой выдачи. Ложное заявление о сертификации и о
 * непередаче данных — прямой юридический риск.
 *
 * Теперь на странице только то, что проверяется по коду: HTTPS, ключи
 * поставщиков на сервере, правила доступа в базе, и честный список внешних
 * сервисов, которым передаются данные.
 */
const DataSecurity: React.FC = () => {
  const securityFeatures = [
    {
      title: 'Защищённое соединение',
      description: 'Сайт и сервер обмениваются данными только по HTTPS',
      icon: Lock
    },
    {
      title: 'Ключи на сервере',
      description: 'Ключи языковой модели и поставщика выдачи хранятся в секретах сервера и в браузер не попадают',
      icon: Key
    },
    {
      title: 'Правила доступа в базе',
      description: 'Аудиты, запущенные после входа, привязаны к учётной записи; доступ к записям ограничен правилами базы данных',
      icon: Shield
    },
    {
      title: 'Запись результатов на сервере',
      description: 'Результаты проверок сохраняет сервер — вписать себе произвольные данные из браузера нельзя',
      icon: Server
    }
  ];

  const thirdParties = [
    {
      name: 'Языковая модель',
      description: 'Для ИИ-оптимизации ей передаются адрес страницы, title, description и сведения о тексте'
    },
    {
      name: 'Поставщик поисковой выдачи',
      description: 'Для проверки позиций ему передаются поисковые запросы, регион и глубина проверки'
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Безопасность данных: соединение, доступы и внешние сервисы"
        description="Как сервис обращается с результатами аудитов: HTTPS, ключи на сервере, правила доступа в базе и какие данные передаются внешним сервисам."
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        {/* Шапка */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Безопасность
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Безопасность данных</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Как сервис обращается с данными ваших проверок и какие внешние сервисы в этом участвуют.
          </p>
        </motion.div>

        {/* Меры безопасности */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Меры безопасности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-3 rounded-full bg-green-100">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Внешние сервисы */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Какие данные передаются внешним сервисам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thirdParties.map((item) => (
                  <div key={item.name} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  Сертификатов ISO 27001, SOC 2 и аналогичных у сервиса нет.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/*
          Здесь были придуманные контакты: почта security@seomarket.com и
          «горячая линия» +7 (495) 123-45-67. Вопрос о защите данных уходил в
          пустоту. Теперь контакты берутся из SITE_CONTACTS, а если их нет —
          предлагаем форму обратной связи, которая работает.
        */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-2">Вопросы о данных и их удалении</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {SITE_CONTACTS.email && (
                  <p>
                    Почта:{' '}
                    <a href={`mailto:${SITE_CONTACTS.email}`} className="text-primary underline">
                      {SITE_CONTACTS.email}
                    </a>
                  </p>
                )}
                {SITE_CONTACTS.telephone && (
                  <p>
                    Телефон:{' '}
                    <a
                      href={`tel:${SITE_CONTACTS.telephone.replace(/[^+\d]/g, '')}`}
                      className="text-primary underline"
                    >
                      {SITE_CONTACTS.telephone}
                    </a>
                  </p>
                )}
                {!SITE_CONTACTS.email && !SITE_CONTACTS.telephone && (
                  <p>
                    Напишите нам через{' '}
                    <Link to="/contact" className="text-primary underline">
                      форму обратной связи
                    </Link>
                    .
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Остались вопросы о данных?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Подробнее о том, какие данные мы обрабатываем, — в политике конфиденциальности.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/privacy">Политика конфиденциальности</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/audit">Проверить сайт</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DataSecurity;
