
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Grid, 
  Layers, 
  Zap, 
  Eye, 
  Download,
  Copy,
  Check,
  Star,
  Heart,
  Sparkles,
  Search,
  Settings,
  User,
  Bell,
  Home,
  Shield,
  Globe
} from 'lucide-react';
import { useState } from 'react';

const Brandbook: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string>('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(type);
    setTimeout(() => setCopiedColor(''), 2000);
  };

  const colorPalette = [
    { name: 'Primary', value: 'hsl(30 85% 50%)', hex: '#FF8C00', usage: 'Основной цвет бренда' },
    { name: 'Secondary', value: 'hsl(222.2 47.4% 11.2%)', hex: '#1A1F2C', usage: 'Вторичный цвет' },
    { name: 'Accent', value: 'hsl(30 85% 50%)', hex: '#FF8C00', usage: 'Акцентный цвет' },
    { name: 'Background', value: 'hsl(225 71% 5%)', hex: '#0A0B14', usage: 'Фон приложения' },
    { name: 'Card', value: 'hsl(224 71% 4%)', hex: '#0C0D16', usage: 'Фон карточек' },
    { name: 'Muted', value: 'hsl(223 47% 11%)', hex: '#171B26', usage: 'Приглушенные элементы' },
    { name: 'Success', value: 'hsl(142 72% 45%)', hex: '#22C55E', usage: 'Успешные действия' },
    { name: 'Warning', value: 'hsl(25 95% 53%)', hex: '#F97316', usage: 'Предупреждения' },
    { name: 'Error', value: 'hsl(0 84% 60%)', hex: '#EF4444', usage: 'Ошибки' },
    { name: 'Info', value: 'hsl(199 89% 48%)', hex: '#0EA5E9', usage: 'Информация' }
  ];

  const typography = [
    { name: 'Playfair Display', type: 'serif', usage: 'Заголовки', weight: '400-700' },
    { name: 'Inter', type: 'sans-serif', usage: 'Основной текст', weight: '300-700' }
  ];

  const spacing = [
    { name: 'xs', value: '0.25rem', px: '4px', usage: 'Минимальные отступы' },
    { name: 'sm', value: '0.5rem', px: '8px', usage: 'Малые отступы' },
    { name: 'md', value: '0.75rem', px: '12px', usage: 'Базовые отступы' },
    { name: 'lg', value: '1rem', px: '16px', usage: 'Стандартные отступы' },
    { name: 'xl', value: '1.5rem', px: '24px', usage: 'Большие отступы' },
    { name: '2xl', value: '2rem', px: '32px', usage: 'Секционные отступы' },
    { name: '3xl', value: '3rem', px: '48px', usage: 'Контейнерные отступы' }
  ];

  const shadows = [
    { name: 'sm', value: 'shadow-sm', usage: 'Легкая тень для кнопок' },
    { name: 'default', value: 'shadow', usage: 'Стандартная тень для карточек' },
    { name: 'md', value: 'shadow-md', usage: 'Средняя тень для dropdown' },
    { name: 'lg', value: 'shadow-lg', usage: 'Большая тень для модалов' },
    { name: 'xl', value: 'shadow-xl', usage: 'Драматическая тень' }
  ];

  const icons = [
    { component: Palette, name: 'Palette', usage: 'Дизайн' },
    { component: Type, name: 'Type', usage: 'Типографика' },
    { component: Grid, name: 'Grid', usage: 'Сетка' },
    { component: Layers, name: 'Layers', usage: 'Слои' },
    { component: Zap, name: 'Zap', usage: 'Производительность' },
    { component: Eye, name: 'Eye', usage: 'Просмотр' },
    { component: Download, name: 'Download', usage: 'Загрузка' },
    { component: Copy, name: 'Copy', usage: 'Копирование' },
    { component: Check, name: 'Check', usage: 'Подтверждение' },
    { component: Star, name: 'Star', usage: 'Избранное' },
    { component: Heart, name: 'Heart', usage: 'Лайк' },
    { component: Sparkles, name: 'Sparkles', usage: 'Магия' },
    { component: Search, name: 'Search', usage: 'Поиск' },
    { component: Settings, name: 'Settings', usage: 'Настройки' },
    { component: User, name: 'User', usage: 'Пользователь' },
    { component: Bell, name: 'Bell', usage: 'Уведомления' },
    { component: Home, name: 'Home', usage: 'Главная' },
    { component: Shield, name: 'Shield', usage: 'Безопасность' },
    { component: Globe, name: 'Globe', usage: 'Интернет' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-16 w-16 text-primary mr-4" />
                <h1 className="text-6xl font-bold font-playfair bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SeoMarket
                </h1>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Брендбук дизайн-системы
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Полное руководство по визуальной идентичности и дизайн-системе платформы SeoMarket. 
                Современный, профессиональный подход к SEO-аналитике.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Palette className="h-4 w-4 mr-2" />
                  10 цветов
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Type className="h-4 w-4 mr-2" />
                  2 шрифта
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Grid className="h-4 w-4 mr-2" />
                  7 отступов
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Layers className="h-4 w-4 mr-2" />
                  5 теней
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-20">
          {/* Color Palette */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Цветовая палитра</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Тщательно подобранная цветовая схема, отражающая современность и профессионализм
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {colorPalette.map((color) => (
                <Card key={color.name} className="group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div 
                      className="w-full h-24 rounded-lg mb-4 border-2 border-border shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <h3 className="font-semibold text-lg mb-2">{color.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">HSL:</span>
                        <button
                          onClick={() => copyToClipboard(color.value, `${color.name}-hsl`)}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          {copiedColor === `${color.name}-hsl` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">{color.value}</code>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">HEX:</span>
                        <button
                          onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          {copiedColor === `${color.name}-hex` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">{color.hex}</code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{color.usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Typography */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Type className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Типографика</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Современные шрифты для создания читаемого и элегантного интерфейса
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {typography.map((font) => (
                <Card key={font.name} className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">{font.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{font.type}</span>
                      <span>•</span>
                      <span>Вес: {font.weight}</span>
                      <span>•</span>
                      <span>{font.usage}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4" style={{ fontFamily: font.name === 'Playfair Display' ? 'Playfair Display' : 'Inter' }}>
                    <div>
                      <p className="text-4xl font-bold">Aa Бб Вв</p>
                      <p className="text-sm text-muted-foreground mt-1">Заглавные и строчные</p>
                    </div>
                    <div>
                      <p className="text-lg">0123456789</p>
                      <p className="text-sm text-muted-foreground mt-1">Цифры</p>
                    </div>
                    <div>
                      <p className="text-base">
                        Быстрая коричневая лиса прыгает через ленивую собаку. 
                        The quick brown fox jumps over the lazy dog.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Пример текста</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Typography Scale */}
            <Card className="mt-8 p-8">
              <h3 className="text-xl font-semibold mb-6">Типографическая шкала</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h1 className="text-6xl font-bold font-playfair">H1 Heading</h1>
                  <p className="text-sm text-muted-foreground">60px • font-bold • Playfair Display</p>
                </div>
                <div className="border-l-4 border-primary/60 pl-4">
                  <h2 className="text-4xl font-semibold font-playfair">H2 Heading</h2>
                  <p className="text-sm text-muted-foreground">48px • font-semibold • Playfair Display</p>
                </div>
                <div className="border-l-4 border-primary/40 pl-4">
                  <h3 className="text-2xl font-semibold font-playfair">H3 Heading</h3>
                  <p className="text-sm text-muted-foreground">32px • font-semibold • Playfair Display</p>
                </div>
                <div className="border-l-4 border-primary/20 pl-4">
                  <p className="text-lg font-inter">Body Large Text</p>
                  <p className="text-sm text-muted-foreground">18px • font-normal • Inter</p>
                </div>
                <div className="border-l-4 border-muted pl-4">
                  <p className="text-base font-inter">Body Text</p>
                  <p className="text-sm text-muted-foreground">16px • font-normal • Inter</p>
                </div>
                <div className="border-l-4 border-muted/60 pl-4">
                  <p className="text-sm font-inter">Small Text</p>
                  <p className="text-sm text-muted-foreground">14px • font-normal • Inter</p>
                </div>
              </div>
            </Card>
          </section>

          <Separator className="my-16" />

          {/* Spacing System */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Grid className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Система отступов</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Консистентная система интервалов для создания гармоничного дизайна
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {spacing.map((space) => (
                <Card key={space.name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{space.name}</h3>
                      <p className="text-sm text-muted-foreground">{space.usage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{space.value}</p>
                      <p className="text-xs text-muted-foreground">{space.px}</p>
                    </div>
                  </div>
                  <div className="h-8 bg-primary/20 rounded" style={{ width: space.value }}>
                    <div className="h-full bg-primary rounded" style={{ width: space.value }} />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Shadows */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Система теней</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Тени для создания глубины и иерархии в интерфейсе
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shadows.map((shadow) => (
                <Card key={shadow.name} className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold capitalize">{shadow.name}</h3>
                    <p className="text-sm text-muted-foreground">{shadow.usage}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">{shadow.value}</code>
                  </div>
                  <div className={`w-full h-20 bg-card border rounded-lg ${shadow.value}`} />
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Icons */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Иконки</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Lucide React иконки для последовательного визуального языка
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {icons.map((icon) => (
                <Card key={icon.name} className="group p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="text-center">
                    <icon.component className="h-8 w-8 mx-auto mb-3 text-primary group-hover:text-accent transition-colors" />
                    <h4 className="font-semibold text-sm">{icon.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{icon.usage}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Components Showcase */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-playfair mb-4">Компоненты UI</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Примеры основных UI компонентов в действии
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Buttons */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Кнопки</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </Card>

              {/* Badges */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Бейджи</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      <Eye className="h-3 w-3 mr-1" />
                      Warning
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <Star className="h-3 w-3 mr-1" />
                      Info
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Progress */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Прогресс</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Завершено</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>В процессе</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Начальная стадия</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} />
                  </div>
                </div>
              </Card>

              {/* Card Variants */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Варианты карточек</h3>
                <div className="space-y-4">
                  <div className="neo-card p-4 rounded-lg">
                    <h4 className="font-semibold">Neo Card</h4>
                    <p className="text-sm text-muted-foreground">Современная карточка с глубиной</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg">
                    <h4 className="font-semibold">Glass Card</h4>
                    <p className="text-sm text-muted-foreground">Стеклянная карточка с размытием</p>
                  </div>
                  <div className="elegant-card p-4 rounded-lg">
                    <h4 className="font-semibold">Elegant Card</h4>
                    <p className="text-sm text-muted-foreground">Элегантная карточка с рамкой</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Brand Guidelines */}
          <section className="mb-20">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="text-center mb-8">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold font-playfair mb-4">Принципы бренда</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Производительность</h3>
                  <p className="text-sm text-muted-foreground">Быстрые и эффективные решения</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Прозрачность</h3>
                  <p className="text-sm text-muted-foreground">Понятные и честные данные</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Надежность</h3>
                  <p className="text-sm text-muted-foreground">Стабильность и безопасность</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Инновации</h3>
                  <p className="text-sm text-muted-foreground">Современные технологии</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Download Section */}
          <section className="text-center">
            <Card className="p-8 bg-card border-primary/20">
              <Download className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-playfair mb-4">Загрузить ресурсы</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Скачайте полный пакет брендбука включая логотипы, иконки, цветовые палитры и шрифты
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Логотипы (SVG)
                </Button>
                <Button variant="outline" size="lg">
                  <Palette className="h-4 w-4 mr-2" />
                  Цветовая палитра
                </Button>
                <Button variant="outline" size="lg">
                  <Type className="h-4 w-4 mr-2" />
                  Шрифты
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Brandbook;
