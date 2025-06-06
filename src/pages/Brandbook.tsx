
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Layout, Image, Download } from 'lucide-react';

const Brandbook: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">Seo</span>Market Brandbook
            </h1>
            <p className="text-lg text-muted-foreground">
              Руководство по фирменному стилю и использованию бренда
            </p>
          </div>

          {/* Logo Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Логотип
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-8 bg-white rounded-lg border">
                  <div className="text-3xl font-bold mb-4">
                    <span className="text-primary">Seo</span>Market
                  </div>
                  <p className="text-sm text-muted-foreground">Основной логотип</p>
                </div>
                <div className="text-center p-8 bg-slate-900 rounded-lg">
                  <div className="text-3xl font-bold mb-4 text-white">
                    <span className="text-orange-400">Seo</span>Market
                  </div>
                  <p className="text-sm text-slate-400">На темном фоне</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Цветовая палитра
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-full h-20 bg-primary rounded-lg mb-2"></div>
                  <p className="font-mono text-sm">Primary</p>
                  <p className="text-xs text-muted-foreground">#F97316</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-secondary rounded-lg mb-2"></div>
                  <p className="font-mono text-sm">Secondary</p>
                  <p className="text-xs text-muted-foreground">#F1F5F9</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-slate-900 rounded-lg mb-2"></div>
                  <p className="font-mono text-sm">Dark</p>
                  <p className="text-xs text-muted-foreground">#0F172A</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-white border rounded-lg mb-2"></div>
                  <p className="font-mono text-sm">Light</p>
                  <p className="text-xs text-muted-foreground">#FFFFFF</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Типографика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Заголовок H1</h1>
                  <p className="text-sm text-muted-foreground">font-size: 2.25rem, font-weight: bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Заголовок H2</h2>
                  <p className="text-sm text-muted-foreground">font-size: 1.875rem, font-weight: semibold</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Заголовок H3</h3>
                  <p className="text-sm text-muted-foreground">font-size: 1.25rem, font-weight: medium</p>
                </div>
                <div>
                  <p className="text-base mb-2">Основной текст</p>
                  <p className="text-sm text-muted-foreground">font-size: 1rem, font-weight: normal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Компоненты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Кнопки</h4>
                  <div className="space-y-2">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      Основная кнопка
                    </button>
                    <button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 transition-colors block">
                      Вторичная кнопка
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Карточки</h4>
                  <div className="border rounded-lg p-4 bg-background">
                    <h5 className="font-medium mb-2">Заголовок карточки</h5>
                    <p className="text-sm text-muted-foreground">
                      Пример содержимого карточки с описанием.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Правила использования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Логотип</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Сохраняйте пропорции логотипа</li>
                    <li>• Минимальный размер: 120px по ширине</li>
                    <li>• Оставляйте свободное пространство вокруг логотипа</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Цвета</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Основной цвет: #F97316 (оранжевый)</li>
                    <li>• Используйте темные цвета для текста на светлом фоне</li>
                    <li>• Обеспечивайте достаточный контраст для читаемости</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Типографика</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Основной шрифт: system-ui, sans-serif</li>
                    <li>• Заголовки: жирное начертание</li>
                    <li>• Основной текст: обычное начертание</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Brandbook;
