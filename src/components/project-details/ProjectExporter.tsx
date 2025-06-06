
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Globe } from 'lucide-react';

const ProjectExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const generateDetailedHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoMarket - Детали проекта</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            font-size: 1.25rem;
            color: #6b7280;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .tabs {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 2rem;
        }
        
        .tab-nav {
            display: flex;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .tab-button {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .tab-button.active {
            color: #8b5cf6;
            border-bottom-color: #8b5cf6;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .card {
            background: white;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border: 1px solid #e5e7eb;
        }
        
        .card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .grid-2 {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .grid-3 {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .stat-card {
            text-align: center;
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #8b5cf6;
        }
        
        .stat-label {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(to right, #8b5cf6, #06b6d4);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #f3f4f6;
            color: #374151;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            margin: 0.25rem;
        }
        
        .badge.green {
            background: #d1fae5;
            color: #065f46;
        }
        
        .badge.blue {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
        }
        
        .feature-list li:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            margin-right: 0.5rem;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .tab-nav {
                flex-direction: column;
            }
            
            .container {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SeoMarket</h1>
            <p>Полное техническое описание проекта и стратегия развития</p>
        </div>
        
        <div class="tabs">
            <div class="tab-nav">
                <button class="tab-button active" onclick="switchTab('overview')">Обзор</button>
                <button class="tab-button" onclick="switchTab('architecture')">Архитектура</button>
                <button class="tab-button" onclick="switchTab('features')">Функции</button>
                <button class="tab-button" onclick="switchTab('production')">Продакшн</button>
                <button class="tab-button" onclick="switchTab('scaling')">Масштабирование</button>
                <button class="tab-button" onclick="switchTab('roadmap')">Роадмап</button>
            </div>
            
            <!-- Overview Tab -->
            <div id="overview" class="tab-content active">
                <div class="card">
                    <h3>О проекте SeoMarket</h3>
                    <div class="grid grid-2">
                        <div>
                            <p>SeoMarket - это комплексная платформа для SEO-аудита и оптимизации веб-сайтов. Проект предоставляет инструменты для глубокого анализа сайтов, автоматического исправления ошибок и отслеживания позиций в поисковых системах.</p>
                            <div class="tech-stack">
                                <span class="badge">React</span>
                                <span class="badge">TypeScript</span>
                                <span class="badge">Supabase</span>
                                <span class="badge">Tailwind CSS</span>
                            </div>
                        </div>
                        <div>
                            <ul class="feature-list">
                                <li>Автоматический SEO-аудит</li>
                                <li>ИИ-powered оптимизация</li>
                                <li>Отслеживание позиций</li>
                                <li>Детальная аналитика</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Прогресс разработки</h3>
                    <div class="grid">
                        <div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Frontend</span>
                                <span style="color: #8b5cf6; font-weight: 600;">90%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 90%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Backend</span>
                                <span style="color: #8b5cf6; font-weight: 600;">80%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 80%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Тестирование</span>
                                <span style="color: #8b5cf6; font-weight: 600;">75%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-3">
                    <div class="stat-card">
                        <div class="stat-value">25+</div>
                        <div class="stat-label">Всего страниц</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">150+</div>
                        <div class="stat-label">Активных пользователей</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">1.2s</div>
                        <div class="stat-label">Время загрузки</div>
                    </div>
                </div>
            </div>
            
            <!-- Architecture Tab -->
            <div id="architecture" class="tab-content">
                <div class="card">
                    <h3>Архитектурные слои</h3>
                    <div class="grid">
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <h4>Presentation Layer</h4>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Пользовательский интерфейс и взаимодействие</p>
                            <div class="tech-stack">
                                <span class="badge">React 18</span>
                                <span class="badge">TypeScript</span>
                                <span class="badge">Tailwind CSS</span>
                            </div>
                            <span class="badge green">90% готово</span>
                        </div>
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <h4>Business Logic Layer</h4>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Бизнес-логика и управление состоянием</p>
                            <div class="tech-stack">
                                <span class="badge">React Hooks</span>
                                <span class="badge">Context API</span>
                                <span class="badge">React Query</span>
                            </div>
                            <span class="badge green">85% готово</span>
                        </div>
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <h4>Data Layer</h4>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Хранение и управление данными</p>
                            <div class="tech-stack">
                                <span class="badge">PostgreSQL</span>
                                <span class="badge">Supabase</span>
                                <span class="badge">RLS Policies</span>
                            </div>
                            <span class="badge blue">75% готово</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Features Tab -->
            <div id="features" class="tab-content">
                <div class="card">
                    <h3>Статус функций</h3>
                    <div class="grid">
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4>Полное сканирование сайта</h4>
                                <span class="badge green">Завершено</span>
                            </div>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Глубокий анализ всех страниц сайта</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4>Анализ метаданных</h4>
                                <span class="badge green">Завершено</span>
                            </div>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Проверка тегов title, description</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 95%;"></div>
                            </div>
                        </div>
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4>Проверка скорости</h4>
                                <span class="badge blue">В процессе</span>
                            </div>
                            <p style="color: #6b7280; margin: 0.5rem 0;">Анализ времени загрузки страниц</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Production Tab -->
            <div id="production" class="tab-content">
                <div class="card">
                    <h3>Готовность к продакшн</h3>
                    <div class="grid grid-2">
                        <div>
                            <h4>Безопасность</h4>
                            <ul class="feature-list">
                                <li>JWT Authentication</li>
                                <li>Row Level Security</li>
                                <li>Data Encryption</li>
                                <li>CORS Configuration</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Производительность</h4>
                            <ul class="feature-list">
                                <li>Code Splitting</li>
                                <li>Lazy Loading</li>
                                <li>Bundle Optimization</li>
                                <li>Caching Strategy</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Scaling Tab -->
            <div id="scaling" class="tab-content">
                <div class="card">
                    <h3>План масштабирования</h3>
                    <div class="grid">
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <h4>0-1K пользователей</h4>
                            <p style="color: #6b7280;">Текущая инфраструктура</p>
                            <div style="margin: 1rem 0;">
                                <span class="badge">Serverless функции</span>
                                <span class="badge">PostgreSQL</span>
                                <span class="badge">Базовое кеширование</span>
                            </div>
                            <p><strong>$50/мес</strong> - примерная стоимость</p>
                        </div>
                        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                            <h4>1K-10K пользователей</h4>
                            <p style="color: #6b7280;">Улучшенная инфраструктура</p>
                            <div style="margin: 1rem 0;">
                                <span class="badge">Redis кеш</span>
                                <span class="badge">CDN</span>
                                <span class="badge">Read replicas</span>
                            </div>
                            <p><strong>$200/мес</strong> - примерная стоимость</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Roadmap Tab -->
            <div id="roadmap" class="tab-content">
                <div class="card">
                    <h3>Дорожная карта развития</h3>
                    <div class="grid">
                        <div style="padding: 1rem; background: #d1fae5; border-radius: 0.5rem;">
                            <h4>Фаза 1: MVP (Завершена)</h4>
                            <p>Базовый функционал SEO-аудита</p>
                            <div class="tech-stack">
                                <span class="badge">Сканирование</span>
                                <span class="badge">Аналиц метаданных</span>
                                <span class="badge">Безопасность</span>
                            </div>
                        </div>
                        <div style="padding: 1rem; background: #dbeafe; border-radius: 0.5rem;">
                            <h4>Фаза 2: UX/Performance (В процессе)</h4>
                            <p>Улучшение производительности и UX</p>
                            <div class="tech-stack">
                                <span class="badge">Скорость загрузки</span>
                                <span class="badge">Мобильная версия</span>
                                <span class="badge">Автоисправление</span>
                            </div>
                        </div>
                        <div style="padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
                            <h4>Фаза 3: Аналитика (Запланирована)</h4>
                            <p>Расширенная аналитика и отслеживание</p>
                            <div class="tech-stack">
                                <span class="badge">Отслеживание позиций</span>
                                <span class="badge">Анализ конкурентов</span>
                                <span class="badge">Аналитика</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function switchTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }
        
        // Add smooth animations
        document.addEventListener('DOMContentLoaded', function() {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });
    </script>
</body>
</html>`;

    return htmlContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const htmlContent = generateDetailedHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'seomarket-project-details.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Экспорт проекта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Экспортируйте полную интерактивную версию деталей проекта в HTML формате
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-green-500" />
            <span>Интерактивные вкладки</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-green-500" />
            <span>Адаптивный дизайн</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-green-500" />
            <span>Полная информация о проекте</span>
          </div>
        </div>
        
        <Button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Экспортируется...' : 'Экспортировать HTML'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
