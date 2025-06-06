
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Clock, 
  Phone, 
  FileText,
  Search,
  Users,
  Zap,
  Shield
} from 'lucide-react';

const Support: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Поддержка | SEO Platform</title>
        <meta name="description" content="Получите помощь по использованию нашей SEO платформы. Техническая поддержка, FAQ, обучающие материалы." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <HelpCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Центр поддержки
            </h1>
            <p className="text-xl text-muted-foreground">
              Мы готовы помочь вам максимально эффективно использовать нашу SEO платформу
            </p>
          </div>

          {/* Способы связи */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email поддержка</h3>
                <p className="text-muted-foreground mb-4">
                  Напишите нам на почту и получите детальный ответ в течение 24 часов
                </p>
                <p className="font-medium text-primary">support@seoplatform.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Онлайн чат</h3>
                <p className="text-muted-foreground mb-4">
                  Получите быстрый ответ от нашей команды поддержки в рабочее время
                </p>
                <Button>Открыть чат</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Телефон</h3>
                <p className="text-muted-foreground mb-4">
                  Для срочных вопросов и технических проблем
                </p>
                <p className="font-medium text-primary">+7 (495) 123-45-67</p>
                <p className="text-sm text-muted-foreground">пн-пт 9:00-18:00 МСК</p>
              </CardContent>
            </Card>
          </div>

          {/* Часто задаваемые вопросы */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Search className="h-5 w-5 text-primary" />
                      Как начать использовать платформу?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Зарегистрируйтесь на сайте, введите URL вашего сайта и запустите первый анализ. 
                      В бесплатном тарифе доступно 3 анализа в месяц. Результаты будут готовы через 2-5 минут.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Сколько времени занимает анализ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Базовый анализ выполняется за 2-5 минут. Глубокий анализ больших сайтов (1000+ страниц) 
                      может занять до 30 минут. Вы получите уведомление на email по завершении.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Можно ли работать в команде?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Да! В тарифах Pro и Enterprise доступна командная работа. Вы можете приглашать коллег, 
                      назначать роли и совместно работать над проектами.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Zap className="h-5 w-5 text-primary" />
                      Какие форматы экспорта доступны?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Результаты анализа можно экспортировать в PDF, Excel (XLSX), CSV и JSON форматах. 
                      Также доступен API для интеграции с другими системами.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      Безопасны ли мои данные?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Абсолютно! Мы используем SSL шифрование, соблюдаем требования GDPR и российского 
                      законодательства. Данные хранятся на защищённых серверах в России.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      Есть ли API документация?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Да, подробная API документация доступна в разделе "Документация". 
                      Там же найдёте примеры кода и SDK для популярных языков программирования.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Не нашли ответ на свой вопрос?</CardTitle>
              <p className="text-center text-muted-foreground">
                Напишите нам, и мы обязательно поможем
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Тема обращения</Label>
                  <Input id="subject" placeholder="Кратко опишите вашу проблему" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Подробно опишите вашу проблему или вопрос..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="text-center">
                  <Button size="lg" className="px-8">
                    Отправить сообщение
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Дополнительные ресурсы */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Полезные ресурсы</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Документация</h3>
                  <p className="text-sm text-muted-foreground">
                    Полная документация по API
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Сообщество</h3>
                  <p className="text-sm text-muted-foreground">
                    Форум пользователей
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Обучение</h3>
                  <p className="text-sm text-muted-foreground">
                    Видеоуроки и гайды
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Блог</h3>
                  <p className="text-sm text-muted-foreground">
                    Новости и советы по SEO
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
