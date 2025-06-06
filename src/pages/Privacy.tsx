
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Политика конфиденциальности | SEO Platform</title>
        <meta name="description" content="Политика конфиденциальности нашей SEO платформы. Узнайте, как мы собираем, используем и защищаем ваши данные." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-muted-foreground">
              Мы серьёзно относимся к защите ваших персональных данных и соблюдаем все требования законодательства
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Последнее обновление: 1 января 2024 года
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  Какие данные мы собираем
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Персональная информация:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Имя и фамилия</li>
                    <li>Адрес электронной почты</li>
                    <li>Номер телефона (по желанию)</li>
                    <li>Название компании (по желанию)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Техническая информация:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>IP-адрес</li>
                    <li>Данные браузера и устройства</li>
                    <li>Время посещения сайта</li>
                    <li>Страницы, которые вы посещаете</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Данные использования сервиса:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>URL сайтов для анализа</li>
                    <li>Результаты SEO аудитов</li>
                    <li>Настройки и предпочтения</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Как мы используем ваши данные
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Предоставление услуг:</span>
                      <span className="text-muted-foreground ml-1">
                        Проведение SEO анализа, генерация отчётов, сохранение истории аудитов
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Улучшение сервиса:</span>
                      <span className="text-muted-foreground ml-1">
                        Анализ использования платформы, разработка новых функций
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Коммуникация:</span>
                      <span className="text-muted-foreground ml-1">
                        Отправка уведомлений о завершении анализа, важных обновлениях
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Безопасность:</span>
                      <span className="text-muted-foreground ml-1">
                        Предотвращение мошенничества, защита от злоупотреблений
                      </span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  Как мы защищаем ваши данные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Мы применяем современные технологии и методы для защиты ваших персональных данных:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Техническая защита:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>SSL шифрование (HTTPS)</li>
                      <li>Безопасное хранение данных</li>
                      <li>Регулярные резервные копии</li>
                      <li>Мониторинг безопасности 24/7</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Организационная защита:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Ограниченный доступ к данным</li>
                      <li>Обучение сотрудников</li>
                      <li>Политики безопасности</li>
                      <li>Аудит безопасности</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Ваши права
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  В соответствии с законодательством о защите персональных данных, вы имеете следующие права:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Право на доступ</h4>
                    <p className="text-sm text-muted-foreground">
                      Получение информации о том, какие данные мы о вас храним
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Право на исправление</h4>
                    <p className="text-sm text-muted-foreground">
                      Исправление неточных или неполных данных
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Право на удаление</h4>
                    <p className="text-sm text-muted-foreground">
                      Удаление ваших персональных данных при определённых условиях
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Право на переносимость</h4>
                    <p className="text-sm text-muted-foreground">
                      Получение ваших данных в структурированном формате
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  Свяжитесь с нами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Если у вас есть вопросы о нашей политике конфиденциальности или вы хотите воспользоваться своими правами, свяжитесь с нами:
                </p>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> privacy@seoplatform.com</p>
                  <p><span className="font-medium">Почтовый адрес:</span> ООО "SEO Платформа", ул. Примерная, 123, Москва, 123456</p>
                  <p><span className="font-medium">Ответственный за защиту данных:</span> privacy@seoplatform.com</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Изменения в политике конфиденциальности</h3>
              <p className="text-muted-foreground text-sm">
                Мы можем время от времени обновлять эту политику конфиденциальности. 
                Все изменения будут опубликованы на этой странице с указанием даты последнего обновления. 
                Существенные изменения будут дополнительно доведены до вашего сведения по электронной почте.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
