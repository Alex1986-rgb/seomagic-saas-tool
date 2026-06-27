
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Zap, Globe, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const partners = [
    {
      name: "Google Analytics",
      logo: "🔍",
      category: "analytics",
      description: "Интеграция с Google Analytics для глубокой аналитики",
      tier: "Premium"
    },
    {
      name: "Yandex.Metrica",
      logo: "📊",
      category: "analytics", 
      description: "Российская система веб-аналитики",
      tier: "Free"
    },
    {
      name: "SEMrush",
      logo: "🎯",
      category: "seo",
      description: "Платформа для SEO и контент-маркетинга",
      tier: "Premium"
    },
    {
      name: "Ahrefs",
      logo: "🔗",
      category: "seo",
      description: "Инструменты для анализа обратных ссылок",
      tier: "Premium"
    },
    {
      name: "Screaming Frog",
      logo: "🐸",
      category: "crawler",
      description: "SEO-краулер для технического аудита",
      tier: "Pro"
    },
    {
      name: "Serpstat",
      logo: "🐍",
      category: "seo",
      description: "Платформа для SEO и PPC исследований",
      tier: "Pro"
    },
    {
      name: "Majestic",
      logo: "👑",
      category: "seo",
      description: "Анализ ссылочного профиля сайтов",
      tier: "Premium"
    },
    {
      name: "SpyFu",
      logo: "🕵️",
      category: "competitive",
      description: "Конкурентная разведка в SEO и PPC",
      tier: "Pro"
    },
    {
      name: "Moz",
      logo: "🦎",
      category: "seo",
      description: "SEO инструменты и метрики",
      tier: "Premium"
    },
    {
      name: "BrightLocal",
      logo: "🌟",
      category: "local-seo",
      description: "Локальное SEO и управление репутацией",
      tier: "Pro"
    },
    {
      name: "GTmetrix",
      logo: "⚡",
      category: "performance",
      description: "Анализ скорости загрузки сайта",
      tier: "Free"
    },
    {
      name: "PageSpeed Insights",
      logo: "🚀",
      category: "performance",
      description: "Google инструмент анализа производительности",
      tier: "Free"
    }
  ];

  const testimonials = [
    {
      name: "Алексей Петров",
      company: "Digital Agency Pro",
      quote: "SeoMarket значительно упростил нашу работу с клиентами. Автоматизация отчетности сэкономила нам десятки часов в месяц.",
      rating: 5
    },
    {
      name: "Мария Сидорова", 
      company: "SEO Expert",
      quote: "Отличная интеграция с нашими любимыми инструментами. Все данные в одном месте - это именно то, что нам было нужно.",
      rating: 5
    },
    {
      name: "Дмитрий Волков",
      company: "WebStudio Plus",
      quote: "White Label решение позволило нам предложить клиентам профессиональные SEO отчеты под нашим брендом.",
      rating: 5
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return <TrendingUp className="h-4 w-4" />;
      case 'seo': return <Zap className="h-4 w-4" />;
      case 'crawler': return <Globe className="h-4 w-4" />;
      case 'competitive': return <Award className="h-4 w-4" />;
      case 'local-seo': return <Users className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free': return 'bg-green-500/15 text-green-600 dark:text-green-400';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Партнерская программа</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Развивайте свой бизнес вместе с SeoMarket. Мы предлагаем 
            различные варианты партнерства и взаимовыгодного сотрудничества.
          </p>
        </div>
        
        <Tabs defaultValue="agency" className="max-w-4xl mx-auto mb-16">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="agency">Для агентств</TabsTrigger>
            <TabsTrigger value="freelancer">Для фрилансеров</TabsTrigger>
            <TabsTrigger value="integration">Интеграции</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agency">
            <Card>
              <CardHeader>
                <CardTitle>Партнерская программа для агентств</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Наша партнерская программа для агентств предоставляет специальные условия использования 
                  платформы SeoMarket для работы с клиентами. Получите доступ к расширенному функционалу, 
                  брендированным отчетам и выгодным тарифам.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Преимущества:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Скидка до 30%</span> 
                      <p className="text-muted-foreground">На все тарифные планы в зависимости от объема использования</p>
                    </li>
                    <li>
                      <span className="font-medium">White Label</span> 
                      <p className="text-muted-foreground">Возможность использования платформы под вашим брендом</p>
                    </li>
                    <li>
                      <span className="font-medium">API доступ</span> 
                      <p className="text-muted-foreground">Полный доступ к API для интеграции с вашими системами</p>
                    </li>
                    <li>
                      <span className="font-medium">Выделенный менеджер</span> 
                      <p className="text-muted-foreground">Персональная поддержка и консультации по использованию платформы</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/partnership')}>Стать партнером</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="freelancer">
            <Card>
              <CardHeader>
                <CardTitle>Программа для фрилансеров</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Идеальное решение для независимых SEO-специалистов и консультантов. Получите инструменты для 
                  эффективной работы с клиентами и создания профессиональных отчетов.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Преимущества:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Специальный тариф</span> 
                      <p className="text-muted-foreground">Доступ к профессиональным инструментам по сниженной цене</p>
                    </li>
                    <li>
                      <span className="font-medium">Экспорт отчетов</span> 
                      <p className="text-muted-foreground">Возможность экспорта отчетов в PDF с вашим логотипом</p>
                    </li>
                    <li>
                      <span className="font-medium">Обучающие материалы</span> 
                      <p className="text-muted-foreground">Доступ к расширенным обучающим материалам и вебинарам</p>
                    </li>
                    <li>
                      <span className="font-medium">Личный кабинет клиентов</span> 
                      <p className="text-muted-foreground">Создавайте аккаунты для ваших клиентов с ограниченным доступом</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/partnership')}>Присоединиться к программе</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>Интеграции и технологические партнерства</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Разрабатываете свой SEO-сервис или смежное решение? Интегрируйте наши технологии анализа и 
                  оптимизации сайтов в ваш продукт через наш API.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Возможности:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">API доступ</span> 
                      <p className="text-muted-foreground">Полный доступ к функционалу платформы через REST API</p>
                    </li>
                    <li>
                      <span className="font-medium">Техническая документация</span> 
                      <p className="text-muted-foreground">Подробная документация и примеры интеграции</p>
                    </li>
                    <li>
                      <span className="font-medium">Техническая поддержка</span> 
                      <p className="text-muted-foreground">Выделенная техническая поддержка для ваших разработчиков</p>
                    </li>
                    <li>
                      <span className="font-medium">Индивидуальные условия</span> 
                      <p className="text-muted-foreground">Возможность обсуждения индивидуальных условий интеграции</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/contact')}>Связаться с нами</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Интеграции */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">Наши интеграции</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            SeoMarket интегрируется с ведущими SEO инструментами и платформами аналитики
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{partner.logo}</div>
                      <div>
                        <CardTitle className="text-sm">{partner.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {getCategoryIcon(partner.category)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {partner.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getTierColor(partner.tier)}`}>
                      {partner.tier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Отзывы партнеров */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">Отзывы наших партнеров</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA секция */}
        <div className="bg-accent/20 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Готовы стать партнером?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Присоединяйтесь к экосистеме SeoMarket и развивайте свой бизнес вместе с нами
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/partnership')}>
              Стать партнером
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Связаться с нами
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Активных партнеров</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Интеграций</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Поддержка</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
