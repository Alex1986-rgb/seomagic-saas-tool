
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, FileText, Download, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PerformanceReports: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-8">
          <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Все возможности</span>
          </Link>
        </div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Отчетность
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Отчеты о производительности</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Детальные отчеты о производительности и рейтинге вашего сайта с экспортом в PDF.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <h2>Профессиональные отчеты для принятия решений</h2>
              
              <p>
                Наша система генерирует детальные отчеты о производительности вашего сайта, 
                которые помогают отслеживать прогресс SEO-оптимизации и принимать 
                обоснованные решения по развитию проекта.
              </p>

              <h3>Типы отчетов:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardContent className="p-6">
                    <FileText className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">SEO Аудит</h4>
                    <p className="text-muted-foreground">
                      Полный отчет по техническому SEO и рекомендациям
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <BarChart className="h-8 w-8 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Позиции</h4>
                    <p className="text-muted-foreground">
                      Динамика позиций и анализ ключевых слов
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>Содержание отчетов:</h3>
              
              <ul>
                <li><strong>Executive Summary</strong> - Краткое резюме для руководства</li>
                <li><strong>Ключевые метрики</strong> - Основные показатели производительности</li>
                <li><strong>Динамика изменений</strong> - Графики и тренды за период</li>
                <li><strong>Проблемы и рекомендации</strong> - Детальный анализ с приоритизацией</li>
                <li><strong>План действий</strong> - Конкретные шаги для улучшения</li>
                <li><strong>Техническая информация</strong> - Подробные технические данные</li>
              </ul>

              <h3>Форматы экспорта:</h3>
              
              <ul>
                <li><strong>PDF</strong> - Профессиональные отчеты для презентаций</li>
                <li><strong>Excel/CSV</strong> - Данные для дальнейшего анализа</li>
                <li><strong>Word</strong> - Редактируемые документы</li>
                <li><strong>PowerPoint</strong> - Готовые презентации</li>
                <li><strong>JSON/API</strong> - Интеграция с другими системами</li>
              </ul>

              <h3>Автоматическая отправка:</h3>
              
              <p>
                Настройте автоматическую отправку отчетов по email с заданной 
                периодичностью. Отчеты могут отправляться еженедельно, ежемесячно 
                или по достижению определенных показателей.
              </p>

              <h3>Белые метки (White Label):</h3>
              
              <p>
                Для агентств и консультантов доступна возможность брендинга отчетов 
                под ваш логотип и фирменный стиль. Создавайте профессиональные 
                отчеты для ваших клиентов.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Форматы отчетов</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Star size={16} className="mt-1 mr-2 text-primary" />
                    <span>PDF отчеты</span>
                  </li>
                  <li className="flex items-start">
                    <FileText size={16} className="mt-1 mr-2 text-primary" />
                    <span>Excel/CSV данные</span>
                  </li>
                  <li className="flex items-start">
                    <Download size={16} className="mt-1 mr-2 text-primary" />
                    <span>Автоматическая отправка</span>
                  </li>
                  <li className="flex items-start">
                    <BarChart size={16} className="mt-1 mr-2 text-primary" />
                    <span>White Label опции</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6">Создать отчет</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceReports;
