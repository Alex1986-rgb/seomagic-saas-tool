
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Code, Package, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ProjectExporter: React.FC = () => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    console.log('Экспорт в PDF');
    toast({
      title: "Экспорт в PDF",
      description: "Функция в разработке",
    });
  };

  const handleExportJSON = () => {
    console.log('Экспорт в JSON');
    toast({
      title: "Экспорт в JSON",
      description: "Функция в разработке",
    });
  };

  const handleExportCode = () => {
    console.log('Экспорт исходного кода');
    toast({
      title: "Экспорт кода",
      description: "Функция в разработке",
    });
  };

  const handleExportArchive = () => {
    console.log('Экспорт архива проекта');
    toast({
      title: "Экспорт архива",
      description: "Функция в разработке",
    });
  };

  const handleExportInteractiveHTML = () => {
    const htmlContent = generateInteractiveHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seomarket-project-details.html';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "HTML экспортирован",
      description: "Интерактивная HTML-страница успешно сохранена",
    });
  };

  const generateInteractiveHTML = () => {
    return `<!DOCTYPE html>
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .tabs-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            backdrop-filter: blur(20px);
        }
        
        .tabs-list {
            display: flex;
            background: rgba(255, 255, 255, 0.8);
            border-bottom: 1px solid #e5e7eb;
            overflow-x: auto;
        }
        
        .tab-trigger {
            flex: 1;
            padding: 16px 20px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 140px;
            white-space: nowrap;
        }
        
        .tab-trigger:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        
        .tab-trigger.active {
            background: #667eea;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .tab-content {
            display: none;
            padding: 40px;
            animation: fadeIn 0.3s ease;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
        }
        
        .card h3 {
            color: #667eea;
            margin-bottom: 16px;
            font-size: 1.5rem;
        }
        
        .card h4 {
            color: #4f46e5;
            margin-bottom: 12px;
            font-size: 1.2rem;
        }
        
        .progress-bar {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 8px 0;
        }
        
        .progress-fill {
            background: linear-gradient(90deg, #667eea, #764ba2);
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            margin: 2px;
        }
        
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .badge-secondary { background: #f3f4f6; color: #374151; }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
        }
        
        .feature-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            transition: transform 0.2s ease;
        }
        
        .feature-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #667eea;
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -24px;
            top: 20px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #667eea;
        }
        
        @media (max-width: 768px) {
            .tabs-list {
                flex-direction: column;
            }
            
            .tab-trigger {
                min-width: auto;
                text-align: left;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .tab-content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SeoMarket</h1>
            <p>Полное техническое описание проекта, готовность к продакшн и стратегия масштабирования</p>
        </div>
        
        <div class="tabs-container">
            <div class="tabs-list">
                <button class="tab-trigger active" onclick="showTab('overview')">Обзор</button>
                <button class="tab-trigger" onclick="showTab('architecture')">Архитектура</button>
                <button class="tab-trigger" onclick="showTab('features')">Статус функций</button>
                <button class="tab-trigger" onclick="showTab('production')">Продакшн</button>
                <button class="tab-trigger" onclick="showTab('scaling')">Масштабирование</button>
                <button class="tab-trigger" onclick="showTab('roadmap')">Роадмап</button>
            </div>
            
            <div id="overview" class="tab-content active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">85%</div>
                        <div class="stat-label">Общая готовность</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">90%</div>
                        <div class="stat-label">Frontend</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">80%</div>
                        <div class="stat-label">Backend</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">150+</div>
                        <div class="stat-label">Активных пользователей</div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>О проекте SeoMarket</h3>
                    <p>SeoMarket - это комплексная платформа для SEO-аудита и оптимизации веб-сайтов. Проект предоставляет инструменты для глубокого анализа сайтов, автоматического исправления ошибок и отслеживания позиций в поисковых системах.</p>
                    <br>
                    <div>
                        <span class="badge badge-info">React</span>
                        <span class="badge badge-info">TypeScript</span>
                        <span class="badge badge-info">Supabase</span>
                        <span class="badge badge-info">Tailwind CSS</span>
                        <span class="badge badge-info">Vite</span>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Ключевые особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 8px;">✅ Автоматический SEO-аудит</li>
                        <li style="margin-bottom: 8px;">✅ ИИ-powered оптимизация</li>
                        <li style="margin-bottom: 8px;">✅ Отслеживание позиций</li>
                        <li style="margin-bottom: 8px;">✅ Детальная аналитика</li>
                        <li style="margin-bottom: 8px;">🔄 Интеграция с CMS (в разработке)</li>
                    </ul>
                </div>
            </div>
            
            <div id="architecture" class="tab-content">
                <div class="card">
                    <h3>Архитектурные слои</h3>
                    <div class="feature-list">
                        <div class="feature-item">
                            <h4>Presentation Layer</h4>
                            <p>Пользовательский интерфейс и взаимодействие</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 90%"></div>
                            </div>
                            <small>90% готовности</small>
                            <br><br>
                            <span class="badge badge-success">React 18</span>
                            <span class="badge badge-success">TypeScript</span>
                            <span class="badge badge-success">Tailwind CSS</span>
                        </div>
                        <div class="feature-item">
                            <h4>Business Logic Layer</h4>
                            <p>Бизнес-логика и управление состоянием</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 85%"></div>
                            </div>
                            <small>85% готовности</small>
                            <br><br>
                            <span class="badge badge-success">React Hooks</span>
                            <span class="badge badge-success">Context API</span>
                            <span class="badge badge-success">React Query</span>
                        </div>
                        <div class="feature-item">
                            <h4>API Layer</h4>
                            <p>Слой взаимодействия с backend сервисами</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 80%"></div>
                            </div>
                            <small>80% готовности</small>
                            <br><br>
                            <span class="badge badge-success">Supabase Client</span>
                            <span class="badge badge-success">REST API</span>
                        </div>
                        <div class="feature-item">
                            <h4>Data Layer</h4>
                            <p>Хранение и управление данными</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%"></div>
                            </div>
                            <small>75% готовности</small>
                            <br><br>
                            <span class="badge badge-warning">PostgreSQL</span>
                            <span class="badge badge-warning">Supabase</span>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Основные сервисы</h3>
                    <div class="feature-list">
                        <div class="feature-item">
                            <h4>Audit Service</h4>
                            <span class="badge badge-success">Продакшн</span>
                            <p>Основной сервис для проведения SEO-аудита сайтов</p>
                        </div>
                        <div class="feature-item">
                            <h4>Crawler Service</h4>
                            <span class="badge badge-success">Продакшн</span>
                            <p>Сервис для сканирования и анализа веб-страниц</p>
                        </div>
                        <div class="feature-item">
                            <h4>Analytics Service</h4>
                            <span class="badge badge-warning">Разработка</span>
                            <p>Сбор и анализ пользовательских данных</p>
                        </div>
                        <div class="feature-item">
                            <h4>Optimization Service</h4>
                            <span class="badge badge-info">Бета</span>
                            <p>ИИ-powered оптимизация контента и SEO</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="features" class="tab-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">3</div>
                        <div class="stat-label">Завершено</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">4</div>
                        <div class="stat-label">В процессе</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">2</div>
                        <div class="stat-label">Запланировано</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">67%</div>
                        <div class="stat-label">Общий прогресс</div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Статус основных функций</h3>
                    <div class="feature-list">
                        <div class="feature-item">
                            <h4>Полное сканирование сайта</h4>
                            <span class="badge badge-success">Завершено</span>
                            <p>Глубокий анализ всех страниц сайта для обнаружения SEO проблем</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <h4>Анализ метаданных</h4>
                            <span class="badge badge-success">Завершено</span>
                            <p>Проверка тегов title, description и других метаданных</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 95%"></div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <h4>Проверка скорости загрузки</h4>
                            <span class="badge badge-warning">В процессе</span>
                            <p>Анализ времени загрузки страниц и рекомендации по оптимизации</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%"></div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <h4>Проверка мобильной версии</h4>
                            <span class="badge badge-warning">В процессе</span>
                            <p>Тестирование адаптивности и удобства использования на мобильных устройствах</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 80%"></div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <h4>Отслеживание позиций</h4>
                            <span class="badge badge-secondary">Запланировано</span>
                            <p>Ежедневный мониторинг позиций сайта в поисковых системах</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="feature-item">
                            <h4>Автоматическое исправление</h4>
                            <span class="badge badge-warning">В процессе</span>
                            <p>ИИ-powered автоматическое исправление найденных SEO-ошибок</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="production" class="tab-content">
                <div class="card">
                    <h3>Готовность к продакшн</h3>
                    <p>Текущее состояние проекта и готовность к развертыванию в production среде.</p>
                    <br>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 85%"></div>
                    </div>
                    <small>85% готовности к продакшн</small>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h4>Безопасность</h4>
                        <span class="badge badge-success">Готово</span>
                        <ul style="margin-top: 10px;">
                            <li>✅ JWT Authentication</li>
                            <li>✅ Row Level Security (RLS)</li>
                            <li>✅ Data Encryption</li>
                            <li>✅ Input Validation</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Производительность</h4>
                        <span class="badge badge-warning">В процессе</span>
                        <ul style="margin-top: 10px;">
                            <li>✅ Code Splitting</li>
                            <li>✅ Lazy Loading</li>
                            <li>🔄 Caching Strategy</li>
                            <li>📋 CDN Integration</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Мониторинг</h4>
                        <span class="badge badge-warning">В процессе</span>
                        <ul style="margin-top: 10px;">
                            <li>✅ Error Tracking</li>
                            <li>✅ Performance Monitoring</li>
                            <li>🔄 Health Checks</li>
                            <li>📋 Alerting System</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Развертывание</h4>
                        <span class="badge badge-success">Готово</span>
                        <ul style="margin-top: 10px;">
                            <li>✅ CI/CD Pipeline</li>
                            <li>✅ Environment Configuration</li>
                            <li>✅ Database Migrations</li>
                            <li>✅ Backup Strategy</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div id="scaling" class="tab-content">
                <div class="card">
                    <h3>Стратегия масштабирования</h3>
                    <p>План по горизонтальному и вертикальному масштабированию системы для обработки растущей нагрузки.</p>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h4>Горизонтальное масштабирование</h4>
                        <ul style="margin-top: 10px;">
                            <li>🔄 Микросервисная архитектура</li>
                            <li>🔄 Load Balancer</li>
                            <li>🔄 Database Sharding</li>
                            <li>📋 Container Orchestration</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Кэширование</h4>
                        <ul style="margin-top: 10px;">
                            <li>✅ Browser Caching</li>
                            <li>🔄 Redis Cache</li>
                            <li>📋 CDN Integration</li>
                            <li>📋 Database Query Cache</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Оптимизация базы данных</h4>
                        <ul style="margin-top: 10px;">
                            <li>✅ Indexes Optimization</li>
                            <li>🔄 Read Replicas</li>
                            <li>📋 Connection Pooling</li>
                            <li>📋 Query Optimization</li>
                        </ul>
                    </div>
                    <div class="feature-item">
                        <h4>Мониторинг производительности</h4>
                        <ul style="margin-top: 10px;">
                            <li>✅ Real-time Metrics</li>
                            <li>🔄 Performance Alerts</li>
                            <li>📋 Auto-scaling Rules</li>
                            <li>📋 Capacity Planning</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div id="roadmap" class="tab-content">
                <div class="card">
                    <h3>Дорожная карта развития</h3>
                    <p>Планы развития проекта на ближайшие 18 месяцев с ключевыми вехами и релизами.</p>
                </div>
                
                <div class="timeline">
                    <div class="timeline-item">
                        <h4>Фаза 1: MVP и основной функционал</h4>
                        <span class="badge badge-success">Завершено</span>
                        <p><strong>Q4 2023 - Q1 2024</strong></p>
                        <p>Реализованы базовые функции SEO-аудита, сканирования сайтов и анализа метаданных.</p>
                        <div style="margin-top: 10px;">
                            <span class="badge badge-secondary">Базовая архитектура</span>
                            <span class="badge badge-secondary">Аутентификация</span>
                            <span class="badge badge-secondary">SEO аудит</span>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <h4>Фаза 2: Улучшения UX/Performance</h4>
                        <span class="badge badge-warning">В процессе</span>
                        <p><strong>Q2 2024 - Q3 2024</strong></p>
                        <p>Работа над производительностью, мобильной версией и автоматическим исправлением ошибок.</p>
                        <div style="margin-top: 10px;">
                            <span class="badge badge-secondary">Скорость загрузки</span>
                            <span class="badge badge-secondary">Мобильная версия</span>
                            <span class="badge badge-secondary">Автоисправление</span>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <h4>Фаза 3: Расширенная аналитика</h4>
                        <span class="badge badge-secondary">Запланировано</span>
                        <p><strong>Q4 2024 - Q1 2025</strong></p>
                        <p>Добавление отслеживания позиций, анализа конкурентов и расширенной аналитики.</p>
                        <div style="margin-top: 10px;">
                            <span class="badge badge-secondary">Отслеживание позиций</span>
                            <span class="badge badge-secondary">Анализ конкурентов</span>
                            <span class="badge badge-secondary">API v1.0</span>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <h4>Фаза 4: Интеграции и масштабирование</h4>
                        <span class="badge badge-secondary">Будущее</span>
                        <p><strong>Q2 2025 - Q3 2025</strong></p>
                        <p>Интеграция с популярными CMS-системами и внешними сервисами.</p>
                        <div style="margin-top: 10px;">
                            <span class="badge badge-secondary">WordPress</span>
                            <span class="badge badge-secondary">Joomla</span>
                            <span class="badge badge-secondary">Enterprise</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tabId) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tab triggers
            const tabTriggers = document.querySelectorAll('.tab-trigger');
            tabTriggers.forEach(trigger => {
                trigger.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabId).classList.add('active');
            
            // Add active class to clicked tab trigger
            event.target.classList.add('active');
        }
        
        // Add smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Animate progress bars
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
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Экспорт проекта
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            onClick={handleExportInteractiveHTML}
            className="flex items-center gap-2 h-auto p-4 flex-col bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200"
          >
            <Globe className="h-6 w-6 text-blue-600" />
            <div className="text-center">
              <div className="font-semibold text-blue-900">Интерактивный HTML</div>
              <div className="text-xs text-blue-700">Демо для разработчиков</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">PDF отчет</div>
              <div className="text-xs text-muted-foreground">Полное описание проекта</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportJSON}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Code className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">JSON данные</div>
              <div className="text-xs text-muted-foreground">Структурированные данные</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportCode}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Package className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Исходный код</div>
              <div className="text-xs text-muted-foreground">Скачать весь проект</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportArchive}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Download className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Архив проекта</div>
              <div className="text-xs text-muted-foreground">ZIP с документацией</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
