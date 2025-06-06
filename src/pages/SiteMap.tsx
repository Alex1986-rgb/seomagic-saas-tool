
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Globe, Search, BarChart, Users, Settings, 
  Shield, CreditCard, FileText, Bell, Activity,
  Database, Server, Monitor, Key, Mail, Lock,
  ChevronRight, ExternalLink, Eye, EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageItem {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  status: 'active' | 'development' | 'planned';
  category: string;
  children?: PageItem[];
}

const SiteMap: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['public']);
  const [hiddenStatuses, setHiddenStatuses] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setHiddenStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const siteStructure: Record<string, PageItem[]> = {
    public: [
      {
        id: 'home',
        title: 'Главная страница',
        path: '/',
        icon: Home,
        description: 'Домашняя страница с презентацией сервиса',
        status: 'active',
        category: 'public'
      },
      {
        id: 'about',
        title: 'О нас',
        path: '/about',
        icon: Users,
        description: 'Информация о компании и команде',
        status: 'active',
        category: 'public'
      },
      {
        id: 'channel',
        title: 'Канал',
        path: '/channel',
        icon: Activity,
        description: 'Информационный канал и новости',
        status: 'active',
        category: 'public'
      },
      {
        id: 'pricing',
        title: 'Тарифы',
        path: '/pricing',
        icon: CreditCard,
        description: 'Тарифные планы и стоимость услуг',
        status: 'active',
        category: 'public'
      },
      {
        id: 'contact',
        title: 'Контакты',
        path: '/contact',
        icon: Mail,
        description: 'Контактная информация',
        status: 'active',
        category: 'public'
      },
      {
        id: 'brandbook',
        title: 'Брендбук',
        path: '/brandbook',
        icon: FileText,
        description: 'Руководство по фирменному стилю',
        status: 'active',
        category: 'public'
      }
    ],
    services: [
      {
        id: 'audit',
        title: 'SEO Аудит',
        path: '/audit',
        icon: Search,
        description: 'Комплексный аудит сайта',
        status: 'active',
        category: 'services',
        children: [
          {
            id: 'site-audit',
            title: 'Анализ сайта',
            path: '/site-audit',
            icon: Globe,
            description: 'Детальный анализ сайта',
            status: 'active',
            category: 'services'
          },
          {
            id: 'optimization-demo',
            title: 'Демо оптимизации',
            path: '/optimization-demo',
            icon: Activity,
            description: 'Демонстрация возможностей оптимизации',
            status: 'active',
            category: 'services'
          }
        ]
      },
      {
        id: 'position-tracking',
        title: 'Отслеживание позиций',
        path: '/position-tracking',
        icon: BarChart,
        description: 'Мониторинг позиций в поисковых системах',
        status: 'active',
        category: 'services',
        children: [
          {
            id: 'position-pricing',
            title: 'Тарифы отслеживания',
            path: '/position-pricing',
            icon: CreditCard,
            description: 'Стоимость услуг отслеживания позиций',
            status: 'active',
            category: 'services'
          }
        ]
      },
      {
        id: 'features',
        title: 'Функции',
        path: '/features',
        icon: Settings,
        description: 'Все возможности платформы',
        status: 'active',
        category: 'services'
      }
    ],
    client: [
      {
        id: 'auth',
        title: 'Авторизация',
        path: '/auth',
        icon: Lock,
        description: 'Вход и регистрация пользователей',
        status: 'active',
        category: 'client'
      },
      {
        id: 'profile',
        title: 'Профиль клиента',
        path: '/profile',
        icon: Users,
        description: 'Личный кабинет пользователя',
        status: 'active',
        category: 'client',
        children: [
          {
            id: 'client-audits',
            title: 'История аудитов',
            path: '/profile?tab=audits',
            icon: Search,
            description: 'Все проведенные аудиты',
            status: 'active',
            category: 'client'
          },
          {
            id: 'client-positions',
            title: 'Позиции сайта',
            path: '/profile?tab=positions',
            icon: BarChart,
            description: 'Отслеживание позиций',
            status: 'active',
            category: 'client'
          },
          {
            id: 'client-reports',
            title: 'Отчеты',
            path: '/profile?tab=reports',
            icon: FileText,
            description: 'Сгенерированные отчеты',
            status: 'active',
            category: 'client'
          },
          {
            id: 'client-subscription',
            title: 'Подписка',
            path: '/profile?tab=subscription',
            icon: CreditCard,
            description: 'Управление подпиской',
            status: 'active',
            category: 'client'
          },
          {
            id: 'client-settings',
            title: 'Настройки',
            path: '/profile?tab=settings',
            icon: Settings,
            description: 'Настройки аккаунта',
            status: 'active',
            category: 'client'
          }
        ]
      }
    ],
    admin: [
      {
        id: 'admin-dashboard',
        title: 'Админ-панель',
        path: '/admin',
        icon: Shield,
        description: 'Главная страница администрирования',
        status: 'active',
        category: 'admin',
        children: [
          {
            id: 'website-analyzer',
            title: 'Анализатор сайтов',
            path: '/admin/website-analyzer',
            icon: Globe,
            description: 'Инструменты для анализа сайтов',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-positions',
            title: 'Позиции',
            path: '/admin/positions',
            icon: BarChart,
            description: 'Управление отслеживанием позиций',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-audits',
            title: 'Аудиты',
            path: '/admin/audits',
            icon: Search,
            description: 'Управление аудитами',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-users',
            title: 'Пользователи',
            path: '/admin/users',
            icon: Users,
            description: 'Управление пользователями',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-payments',
            title: 'Платежи',
            path: '/admin/payments',
            icon: CreditCard,
            description: 'Управление платежами',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-analytics',
            title: 'Аналитика',
            path: '/admin/analytics',
            icon: Activity,
            description: 'Аналитические данные',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-monitoring',
            title: 'Мониторинг',
            path: '/admin/monitoring',
            icon: Monitor,
            description: 'Мониторинг системы',
            status: 'active',
            category: 'admin'
          },
          {
            id: 'admin-settings',
            title: 'Настройки системы',
            path: '/admin/settings',
            icon: Settings,
            description: 'Системные настройки',
            status: 'active',
            category: 'admin'
          }
        ]
      }
    ],
    content: [
      {
        id: 'blog',
        title: 'Блог',
        path: '/blog',
        icon: FileText,
        description: 'Статьи и новости',
        status: 'active',
        category: 'content'
      },
      {
        id: 'documentation',
        title: 'Документация',
        path: '/documentation',
        icon: FileText,
        description: 'Техническая документация',
        status: 'active',
        category: 'content'
      },
      {
        id: 'guides',
        title: 'Руководства',
        path: '/guides',
        icon: FileText,
        description: 'Обучающие материалы',
        status: 'active',
        category: 'content'
      },
      {
        id: 'faq',
        title: 'FAQ',
        path: '/faq',
        icon: FileText,
        description: 'Часто задаваемые вопросы',
        status: 'active',
        category: 'content'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'development': return 'bg-yellow-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'development': return 'Разработка';
      case 'planned': return 'Планируется';
      default: return 'Неизвестно';
    }
  };

  const renderPageItem = (item: PageItem, level = 0) => {
    if (hiddenStatuses.includes(item.status)) return null;

    const Icon = item.icon;
    const paddingLeft = level * 20;

    return (
      <div key={item.id} className="mb-2">
        <div 
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Icon className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{item.title}</h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(item.status)} text-white`}
                >
                  {getStatusText(item.status)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={item.path}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            {item.children && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => toggleCategory(item.id)}
              >
                <ChevronRight 
                  className={`h-3 w-3 transition-transform ${
                    expandedCategories.includes(item.id) ? 'rotate-90' : ''
                  }`} 
                />
              </Button>
            )}
          </div>
        </div>
        
        {item.children && expandedCategories.includes(item.id) && (
          <div className="mt-2">
            {item.children.map(child => renderPageItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const categoryTitles = {
    public: 'Публичные страницы',
    services: 'Сервисы и инструменты',
    client: 'Клиентская часть',
    admin: 'Административная панель',
    content: 'Контент и документация'
  };

  const categoryIcons = {
    public: Globe,
    services: Settings,
    client: Users,
    admin: Shield,
    content: FileText
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Интерактивная карта сайта <span className="text-primary">SeoMarket</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Полная архитектура проекта со всеми страницами, функциями и разделами
            </p>
          </div>

          {/* Фильтры по статусу */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Фильтры отображения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['active', 'development', 'planned'].map(status => (
                  <Button
                    key={status}
                    variant={hiddenStatuses.includes(status) ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleStatus(status)}
                    className="gap-2"
                  >
                    {hiddenStatuses.includes(status) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {getStatusText(status)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Активные страницы</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {Object.values(siteStructure).flat().filter(item => item.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">В разработке</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {Object.values(siteStructure).flat().filter(item => item.status === 'development').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <span className="text-sm font-medium">Планируется</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {Object.values(siteStructure).flat().filter(item => item.status === 'planned').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Разделы сайта */}
          <div className="space-y-6">
            {Object.entries(siteStructure).map(([categoryKey, pages]) => {
              const CategoryIcon = categoryIcons[categoryKey as keyof typeof categoryIcons];
              const isExpanded = expandedCategories.includes(categoryKey);
              
              return (
                <Card key={categoryKey}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-xl">
                          {categoryTitles[categoryKey as keyof typeof categoryTitles]}
                        </CardTitle>
                        <Badge variant="outline">
                          {pages.length} страниц
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(categoryKey)}
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent>
                      <div className="space-y-2">
                        {pages.map(page => renderPageItem(page))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Дополнительная информация */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Техническая информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Технологии</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• React 18 с TypeScript</li>
                    <li>• React Router для маршрутизации</li>
                    <li>• Tailwind CSS для стилизации</li>
                    <li>• Shadcn/ui компоненты</li>
                    <li>• Framer Motion для анимаций</li>
                    <li>• Supabase для бэкенда</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Архитектура</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Компонентная архитектура</li>
                    <li>• Разделение на публичную и приватную зоны</li>
                    <li>• Административная панель</li>
                    <li>• Система аутентификации</li>
                    <li>• API интеграции</li>
                    <li>• Responsive дизайн</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SiteMap;
