
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Mail } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Пользовательское соглашение | SEO Platform</title>
        <meta name="description" content="Условия использования нашей SEO платформы. Права и обязанности пользователей, правила предоставления услуг." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Пользовательское соглашение
            </h1>
            <p className="text-xl text-muted-foreground">
              Условия использования нашей SEO платформы и предоставляемых услуг
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Дата вступления в силу: 1 января 2024 года
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Общие положения
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между 
                  ООО "SEO Платформа" (далее — «Компания», «мы») и пользователями (далее — «Пользователь», «вы») 
                  при использовании веб-сайта и сервисов SEO анализа.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Важно:</strong> Используя наш сервис, вы подтверждаете, что прочитали, поняли 
                    и согласны соблюдать условия данного соглашения.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Права и обязанности пользователей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Права пользователей:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Использовать сервис для анализа сайтов в соответствии с условиями тарифного плана
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Получать техническую поддержку по вопросам использования сервиса
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Экспортировать результаты анализа в доступных форматах
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Прекратить использование сервиса в любое время
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Обязанности пользователей:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Предоставлять точную и актуальную информацию при регистрации
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Использовать сервис только для законных целей
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Не превышать лимиты использования согласно тарифному плану
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">
                        Обеспечивать безопасность своих учётных данных
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Оплата и тарифы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Тарифные планы:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Бесплатный план: ограниченное количество анализов в месяц</li>
                    <li>Платные планы: расширенный функционал и увеличенные лимиты</li>
                    <li>Корпоративные планы: индивидуальные условия для больших команд</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Условия оплаты:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Оплата производится авансом за выбранный период</li>
                    <li>Автоматическое продление подписки (можно отключить в настройках)</li>
                    <li>Возврат средств возможен в течение 14 дней при отсутствии использования</li>
                    <li>НДС включён в стоимость для резидентов РФ</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Описание услуг
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Наша платформа предоставляет следующие основные услуги:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">SEO анализ сайтов:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Технический аудит</li>
                      <li>Анализ контента</li>
                      <li>Проверка мета-тегов</li>
                      <li>Анализ ссылочной структуры</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Дополнительные функции:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Мониторинг позиций</li>
                      <li>Экспорт отчётов</li>
                      <li>API для интеграций</li>
                      <li>Командная работа</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Обратите внимание:</strong> Результаты анализа носят рекомендательный характер. 
                    Мы не гарантируем конкретные результаты в поисковых системах при следовании рекомендациям.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Ограничения и запреты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  При использовании нашего сервиса запрещается:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Анализировать сайты, нарушающие законодательство РФ
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Попытки обхода технических ограничений сервиса
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Создание чрезмерной нагрузки на серверы
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Передача учётных данных третьим лицам
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Попытки получения доступа к чужим данным
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ответственность сторон</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ответственность Компании:</h4>
                  <p className="text-muted-foreground text-sm mb-2">
                    Мы обязуемся предоставлять сервис в соответствии с заявленными характеристиками, 
                    обеспечивать безопасность данных и предоставлять техническую поддержку.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Ответственность ограничивается суммой, уплаченной за услуги за последние 12 месяцев.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ответственность Пользователя:</h4>
                  <p className="text-muted-foreground text-sm">
                    Пользователь несёт полную ответственность за законность анализируемых сайтов, 
                    соблюдение условий использования и последствия применения полученных рекомендаций.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  Контакты и поддержка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  По всем вопросам, связанным с данным соглашением, обращайтесь:
                </p>
                <div className="space-y-2">
                  <p><span className="font-medium">Email поддержки:</span> support@seoplatform.com</p>
                  <p><span className="font-medium">Юридический адрес:</span> ООО "SEO Платформа", ул. Примерная, 123, Москва, 123456</p>
                  <p><span className="font-medium">ИНН:</span> 1234567890</p>
                  <p><span className="font-medium">Время работы поддержки:</span> пн-пт 9:00-18:00 (МСК)</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Заключительные положения</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Данное соглашение может быть изменено в одностороннем порядке с уведомлением пользователей
                </p>
                <p>
                  • Все споры решаются в соответствии с законодательством Российской Федерации
                </p>
                <p>
                  • При признании отдельных положений недействительными, остальная часть соглашения остаётся в силе
                </p>
                <p>
                  • Соглашение действует до момента прекращения использования сервиса любой из сторон
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
