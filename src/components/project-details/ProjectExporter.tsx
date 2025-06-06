import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';

const ProjectExporter: React.FC = () => {
  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoMarket - Детали проекта</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .card-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e5e7eb;
            background: #f9fafb;
        }
        
        .card-content {
            padding: 2rem;
        }
        
        .tabs {
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 2rem;
        }
        
        .tab-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0 1rem;
        }
        
        .tab-button {
            padding: 0.75rem 1.5rem;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 8px 8px 0 0;
            font-weight: 500;
            transition: all 0.3s ease;
            color: #6b7280;
        }
        
        .tab-button.active {
            background: white;
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
        }
        
        .tab-button:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .progress-bar {
            background: #e5e7eb;
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 10px;
            transition: width 0.8s ease;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            margin: 0.25rem;
        }
        
        .badge-primary { background: #dbeafe; color: #1d4ed8; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-secondary { background: #f3f4f6; color: #374151; }
        
        .grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        
        @media (max-width: 768px) {
            .grid-cols-2, .grid-cols-3, .grid-cols-4 {
                grid-template-columns: 1fr;
            }
            .tab-list {
                flex-direction: column;
            }
        }
        
        .metric-card {
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #3b82f6;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            transition: background 0.2s ease;
        }
        
        .feature-item:hover {
            background: #f9fafb;
        }
        
        .status-completed { color: #10b981; }
        .status-progress { color: #f59e0b; }
        .status-planned { color: #6b7280; }
        
        .architecture-layer {
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 1rem;
            background: #fafafa;
        }
        
        .cost-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .cost-table th,
        .cost-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .cost-table th {
            background: #f9fafb;
            font-weight: 600;
        }
        
        .roadmap-phase {
            padding: 1.5rem;
            border-left: 4px solid #3b82f6;
            background: #f8fafc;
            margin-bottom: 1.5rem;
            border-radius: 0 8px 8px 0;
        }
        
        .milestone {
            display: flex;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 0.5rem;
        }
        
        .milestone-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 1rem;
        }
        
        .milestone-completed { background: #10b981; }
        .milestone-progress { background: #f59e0b; }
        .milestone-planned { background: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold mb-6 text-white">SeoMarket - Детали проекта</h1>
            <p class="text-xl text-white opacity-90 max-w-3xl mx-auto">
                Полное техническое описание проекта, готовность к продакшн и стратегия масштабирования
            </p>
        </div>
        
        <div class="card">
            <div class="tabs">
                <div class="tab-list">
                    <button class="tab-button active" onclick="showTab('overview')">Обзор</button>
                    <button class="tab-button" onclick="showTab('architecture')">Архитектура</button>
                    <button class="tab-button" onclick="showTab('features')">Статус функций</button>
                    <button class="tab-button" onclick="showTab('production')">Продакшн</button>
                    <button class="tab-button" onclick="showTab('scaling')">Масштабирование</button>
                    <button class="tab-button" onclick="showTab('roadmap')">Роадмап</button>
                </div>
            </div>
            
            <!-- Обзор -->
            <div id="overview" class="tab-content active">
                <div class="card-content">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 class="text-xl font-semibold mb-4">О проекте SeoMarket</h3>
                            <p class="text-gray-600 mb-4">
                                SeoMarket - это комплексная платформа для SEO-аудита и оптимизации веб-сайтов. 
                                Проект предоставляет инструменты для глубокого анализа сайтов, автоматического 
                                исправления ошибок и отслеживания позиций в поисковых системах.
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <span class="badge badge-secondary">React</span>
                                <span class="badge badge-secondary">TypeScript</span>
                                <span class="badge badge-secondary">Supabase</span>
                                <span class="badge badge-secondary">Tailwind CSS</span>
                                <span class="badge badge-secondary">Vite</span>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-4">Ключевые особенности</h3>
                            <div class="space-y-2">
                                <div class="feature-item">
                                    <i class="fas fa-check-circle status-completed mr-3"></i>
                                    <span>Автоматический SEO-аудит</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check-circle status-completed mr-3"></i>
                                    <span>ИИ-powered оптимизация</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check-circle status-completed mr-3"></i>
                                    <span>Отслеживание позиций</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check-circle status-completed mr-3"></i>
                                    <span>Детальная аналитика</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-clock status-progress mr-3"></i>
                                    <span>Интеграция с CMS (в разработке)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold mb-4">Прогресс разработки</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span>Общая готовность</span>
                                    <span class="font-semibold text-green-600">85%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 85%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span>Frontend</span>
                                    <span class="font-semibold text-blue-600">90%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 90%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span>Backend</span>
                                    <span class="font-semibold text-purple-600">80%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 80%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span>Тестирование</span>
                                    <span class="font-semibold text-orange-600">75%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div class="metric-card">
                            <i class="fas fa-globe icon"></i>
                            <div class="text-2xl font-bold">25+</div>
                            <div class="text-sm text-gray-600">Всего страниц</div>
                            <div class="text-xs text-green-600 mt-1">+15%</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-users icon"></i>
                            <div class="text-2xl font-bold">150+</div>
                            <div class="text-sm text-gray-600">Активных пользователей</div>
                            <div class="text-xs text-green-600 mt-1">+25%</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-clock icon"></i>
                            <div class="text-2xl font-bold">1.2s</div>
                            <div class="text-sm text-gray-600">Время загрузки</div>
                            <div class="text-xs text-green-600 mt-1">-20%</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-shield-alt icon"></i>
                            <div class="text-2xl font-bold">Высокий</div>
                            <div class="text-sm text-gray-600">Уровень безопасности</div>
                            <div class="text-xs text-green-600 mt-1">+10%</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 class="font-semibold mb-3">Frontend</h4>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span>React 18</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>TypeScript</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Tailwind CSS</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Framer Motion</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-3">Backend</h4>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span>Supabase</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>PostgreSQL</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Edge Functions</span>
                                    <span class="badge badge-warning">Тестирование</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Real-time API</span>
                                    <span class="badge badge-primary">Интеграция</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-3">Инструменты</h4>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span>Vite</span>
                                    <span class="badge badge-success">Стабильно</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>ESLint</span>
                                    <span class="badge badge-secondary">Настроено</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Prettier</span>
                                    <span class="badge badge-secondary">Настроено</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Lovable</span>
                                    <span class="badge badge-primary">Активно</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Архитектура -->
            <div id="architecture" class="tab-content">
                <div class="card-content">
                    <h3 class="text-xl font-semibold mb-6">Архитектурные слои</h3>
                    
                    <div class="architecture-layer">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-desktop mr-3 text-blue-500"></i>
                                <h4 class="text-lg font-semibold">Presentation Layer</h4>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-success">Стабильно</span>
                                <span class="text-sm text-gray-600">90%</span>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-3">Пользовательский интерфейс и взаимодействие</p>
                        <div class="flex flex-wrap gap-2">
                            <span class="badge badge-secondary">React 18</span>
                            <span class="badge badge-secondary">TypeScript</span>
                            <span class="badge badge-secondary">Tailwind CSS</span>
                            <span class="badge badge-secondary">Framer Motion</span>
                        </div>
                    </div>
                    
                    <div class="architecture-layer">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-layer-group mr-3 text-purple-500"></i>
                                <h4 class="text-lg font-semibold">Business Logic Layer</h4>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-success">Стабильно</span>
                                <span class="text-sm text-gray-600">85%</span>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-3">Бизнес-логика и управление состоянием</p>
                        <div class="flex flex-wrap gap-2">
                            <span class="badge badge-secondary">React Hooks</span>
                            <span class="badge badge-secondary">Context API</span>
                            <span class="badge badge-secondary">React Query</span>
                            <span class="badge badge-secondary">Custom Services</span>
                        </div>
                    </div>
                    
                    <div class="architecture-layer">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-cloud mr-3 text-green-500"></i>
                                <h4 class="text-lg font-semibold">API Layer</h4>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-success">Стабильно</span>
                                <span class="text-sm text-gray-600">80%</span>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-3">Слой взаимодействия с backend сервисами</p>
                        <div class="flex flex-wrap gap-2">
                            <span class="badge badge-secondary">Supabase Client</span>
                            <span class="badge badge-secondary">REST API</span>
                            <span class="badge badge-secondary">Real-time Subscriptions</span>
                        </div>
                    </div>
                    
                    <div class="architecture-layer">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-database mr-3 text-orange-500"></i>
                                <h4 class="text-lg font-semibold">Data Layer</h4>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-warning">В разработке</span>
                                <span class="text-sm text-gray-600">75%</span>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-3">Хранение и управление данными</p>
                        <div class="flex flex-wrap gap-2">
                            <span class="badge badge-secondary">PostgreSQL</span>
                            <span class="badge badge-secondary">Supabase</span>
                            <span class="badge badge-secondary">RLS Policies</span>
                            <span class="badge badge-secondary">Migrations</span>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-6 mt-8">Основные сервисы</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="p-4 border border-gray-200 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold">Audit Service</h4>
                                <span class="badge badge-success">Продакшн</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">Основной сервис для проведения SEO-аудита сайтов</p>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-600">Эндпоинты:</p>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/audit/start</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/audit/status</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/audit/results</code>
                            </div>
                        </div>
                        
                        <div class="p-4 border border-gray-200 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold">Crawler Service</h4>
                                <span class="badge badge-success">Продакшн</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">Сервис для сканирования и анализа веб-страниц</p>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-600">Эндпоинты:</p>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/crawl/deep</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/crawl/sitemap</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/crawl/pages</code>
                            </div>
                        </div>
                        
                        <div class="p-4 border border-gray-200 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold">Analytics Service</h4>
                                <span class="badge badge-warning">Разработка</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">Сбор и анализ пользовательских данных</p>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-600">Эндпоинты:</p>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/analytics/track</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/analytics/report</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/analytics/export</code>
                            </div>
                        </div>
                        
                        <div class="p-4 border border-gray-200 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold">Optimization Service</h4>
                                <span class="badge badge-primary">Бета</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">ИИ-powered оптимизация контента и SEO</p>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-600">Эндпоинты:</p>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/optimize/content</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/optimize/meta</code>
                                <code class="block text-xs bg-gray-100 p-1 rounded">/api/optimize/structure</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Статус функций -->
            <div id="features" class="tab-content">
                <div class="card-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">3</div>
                            <div class="text-sm text-gray-600">Завершено</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">4</div>
                            <div class="text-sm text-gray-600">В процессе</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-orange-600">2</div>
                            <div class="text-sm text-gray-600">Запланировано</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gray-600">1</div>
                            <div class="text-sm text-gray-600">Не начато</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">67%</div>
                            <div class="text-sm text-gray-600">Общий прогресс</div>
                        </div>
                    </div>
                    
                    <div class="progress-bar mb-8">
                        <div class="progress-fill" style="width: 67%"></div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Аудит</h3>
                    <div class="space-y-4 mb-8">
                        <div class="feature-item">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <i class="fas fa-search mr-3 text-blue-500"></i>
                                    <div>
                                        <h4 class="font-medium">Полное сканирование сайта</h4>
                                        <p class="text-sm text-gray-600">Глубокий анализ всех страниц сайта для обнаружения SEO проблем</p>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle status-completed"></i>
                                        <span class="badge badge-success">Завершено</span>
                                    </div>
                                    <span class="badge badge-warning">Высокий приоритет</span>
                                </div>
                            </div>
                            <div class="w-full mt-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Прогресс: 100%</span>
                                    <span>40/40 часов</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <i class="fas fa-file-alt mr-3 text-blue-500"></i>
                                    <div>
                                        <h4 class="font-medium">Анализ метаданных</h4>
                                        <p class="text-sm text-gray-600">Проверка тегов title, description и других метаданных</p>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle status-completed"></i>
                                        <span class="badge badge-success">Завершено</span>
                                    </div>
                                    <span class="badge badge-warning">Высокий приоритет</span>
                                </div>
                            </div>
                            <div class="w-full mt-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Прогресс: 95%</span>
                                    <span>19/20 часов</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 95%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Производительность</h3>
                    <div class="space-y-4 mb-8">
                        <div class="feature-item">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <i class="fas fa-bolt mr-3 text-yellow-500"></i>
                                    <div>
                                        <h4 class="font-medium">Проверка скорости загрузки</h4>
                                        <p class="text-sm text-gray-600">Анализ времени загрузки страниц и рекомендации по оптимизации</p>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-clock status-progress"></i>
                                        <span class="badge badge-primary">В процессе</span>
                                    </div>
                                    <span class="badge badge-secondary">Средний приоритет</span>
                                </div>
                            </div>
                            <div class="w-full mt-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Прогресс: 75%</span>
                                    <span>22/30 часов</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">UX/UI</h3>
                    <div class="space-y-4 mb-8">
                        <div class="feature-item">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <i class="fas fa-mobile-alt mr-3 text-green-500"></i>
                                    <div>
                                        <h4 class="font-medium">Проверка мобильной версии</h4>
                                        <p class="text-sm text-gray-600">Тестирование адаптивности и удобства использования на мобильных устройствах</p>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-clock status-progress"></i>
                                        <span class="badge badge-primary">В процессе</span>
                                    </div>
                                    <span class="badge badge-warning">Высокий приоритет</span>
                                </div>
                            </div>
                            <div class="w-full mt-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Прогресс: 80%</span>
                                    <span>20/25 часов</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 80%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Безопасность</h3>
                    <div class="space-y-4">
                        <div class="feature-item">
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <i class="fas fa-shield-alt mr-3 text-red-500"></i>
                                    <div>
                                        <h4 class="font-medium">Безопасность данных</h4>
                                        <p class="text-sm text-gray-600">Полная конфиденциальность и безопасность данных с соблюдением GDPR</p>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle status-completed"></i>
                                        <span class="badge badge-success">Завершено</span>
                                    </div>
                                    <span class="badge" style="background: #fee2e2; color: #991b1b;">Критично</span>
                                </div>
                            </div>
                            <div class="w-full mt-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Прогресс: 90%</span>
                                    <span>27/30 часов</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 90%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Продакшн -->
            <div id="production" class="tab-content">
                <div class="card-content">
                    <h3 class="text-xl font-semibold mb-6">Готовность к продакшн</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div class="metric-card">
                            <i class="fas fa-check-circle icon text-green-500"></i>
                            <div class="text-2xl font-bold text-green-600">85%</div>
                            <div class="text-sm text-gray-600">Общая готовность</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-server icon text-blue-500"></i>
                            <div class="text-2xl font-bold text-blue-600">99.9%</div>
                            <div class="text-sm text-gray-600">Uptime</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-tachometer-alt icon text-purple-500"></i>
                            <div class="text-2xl font-bold text-purple-600">1.2s</div>
                            <div class="text-sm text-gray-600">Время отклика</div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-shield-alt icon text-red-500"></i>
                            <div class="text-2xl font-bold text-red-600">A+</div>
                            <div class="text-sm text-gray-600">Безопасность</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h4 class="font-semibold mb-4">Функции безопасности</h4>
                            <div class="space-y-3">
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">Row Level Security (RLS)</h5>
                                        <p class="text-sm text-gray-600">Контроль доступа на уровне строк БД</p>
                                    </div>
                                    <span class="badge badge-success">Внедрено</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">JWT Authentication</h5>
                                        <p class="text-sm text-gray-600">Безопасная аутентификация пользователей</p>
                                    </div>
                                    <span class="badge badge-success">Внедрено</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">API Rate Limiting</h5>
                                        <p class="text-sm text-gray-600">Ограничение частоты запросов к API</p>
                                    </div>
                                    <span class="badge badge-secondary">Планируется</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">Data Encryption</h5>
                                        <p class="text-sm text-gray-600">Шифрование данных в покое и в транзите</p>
                                    </div>
                                    <span class="badge badge-success">Внедрено</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold mb-4">Мониторинг и логирование</h4>
                            <div class="space-y-3">
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">Error Tracking</h5>
                                        <p class="text-sm text-gray-600">Отслеживание и анализ ошибок</p>
                                    </div>
                                    <span class="badge badge-success">Активно</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">Performance Monitoring</h5>
                                        <p class="text-sm text-gray-600">Мониторинг производительности</p>
                                    </div>
                                    <span class="badge badge-warning">Настройка</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <h5 class="font-medium">Application Logs</h5>
                                        <p class="text-sm text-gray-600">Централизованные логи приложения</p>
                                    </div>
                                    <span class="badge badge-success">Настроено</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-semibold text-blue-900 mb-2">🚀 Следующие шаги для продакшн:</h4>
                        <ul class="text-sm text-blue-800 space-y-1">
                            <li>• Настройка автоматического масштабирования</li>
                            <li>• Внедрение системы резервного копирования</li>
                            <li>• Настройка CDN для глобального распределения</li>
                            <li>• Проведение нагрузочного тестирования</li>
                            <li>• Подготовка процедур восстановления после сбоев</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Масштабирование -->
            <div id="scaling" class="tab-content">
                <div class="card-content">
                    <h3 class="text-xl font-semibold mb-6">Стратегия масштабирования</h3>
                    
                    <div class="space-y-6 mb-8">
                        <div class="p-6 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xl font-bold">0-1K пользователей</h4>
                                <div class="flex gap-4 text-sm">
                                    <span class="flex items-center gap-1">
                                        <i class="fas fa-clock"></i>
                                        Q1 2024
                                    </span>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                    <h5 class="font-semibold mb-2">Ключевые технологии:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Serverless функции</li>
                                        <li>• PostgreSQL</li>
                                        <li>• Базовое кеширование</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Основные вызовы:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Оптимизация кода</li>
                                        <li>• Базовый мониторинг</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Инфраструктура:</h5>
                                    <p class="text-sm mb-2">Текущая</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg font-bold">$50/мес</span>
                                        <span class="text-sm text-gray-600">примерная стоимость</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-6 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xl font-bold">1K-10K пользователей</h4>
                                <div class="flex gap-4 text-sm">
                                    <span class="flex items-center gap-1">
                                        <i class="fas fa-clock"></i>
                                        Q2-Q3 2024
                                    </span>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                    <h5 class="font-semibold mb-2">Ключевые технологии:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Redis кеш</li>
                                        <li>• CDN</li>
                                        <li>• Read replicas</li>
                                        <li>• Error tracking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Основные вызовы:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Производительность БД</li>
                                        <li>• Кеширование стратегий</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Инфраструктура:</h5>
                                    <p class="text-sm mb-2">Улучшенная</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg font-bold">$200/мес</span>
                                        <span class="text-sm text-gray-600">примерная стоимость</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-6 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xl font-bold">10K-100K пользователей</h4>
                                <div class="flex gap-4 text-sm">
                                    <span class="flex items-center gap-1">
                                        <i class="fas fa-clock"></i>
                                        Q4 2024 - Q2 2025
                                    </span>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                    <h5 class="font-semibold mb-2">Ключевые технологии:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Микросервисы</li>
                                        <li>• Auto-scaling</li>
                                        <li>• Multiple regions</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Основные вызовы:</h5>
                                    <ul class="text-sm space-y-1">
                                        <li>• Архитектурная сложность</li>
                                        <li>• Команда разработчиков</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold mb-2">Инфраструктура:</h5>
                                    <p class="text-sm mb-2">Масштабируемая</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg font-bold">$1K/мес</span>
                                        <span class="text-sm text-gray-600">примерная стоимость</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Анализ затрат на масштабирование</h3>
                    <table class="cost-table mb-6">
                        <thead>
                            <tr>
                                <th>Категория</th>
                                <th>Сейчас</th>
                                <th>1K users</th>
                                <th>10K users</th>
                                <th>100K users</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Хостинг и инфраструктура</td>
                                <td>$30/мес</td>
                                <td>$80/мес</td>
                                <td>$400/мес</td>
                                <td>$2000/мес</td>
                            </tr>
                            <tr>
                                <td>База данных</td>
                                <td>$25/мес</td>
                                <td>$60/мес</td>
                                <td>$300/мес</td>
                                <td>$1500/мес</td>
                            </tr>
                            <tr>
                                <td>CDN и кеширование</td>
                                <td>$0</td>
                                <td>$20/мес</td>
                                <td>$100/мес</td>
                                <td>$500/мес</td>
                            </tr>
                            <tr>
                                <td>Мониторинг и логи</td>
                                <td>$0</td>
                                <td>$30/мес</td>
                                <td>$150/мес</td>
                                <td>$800/мес</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr style="background: #f9fafb; font-weight: bold;">
                                <td>Итого месячные расходы</td>
                                <td>$55</td>
                                <td>$190</td>
                                <td>$950</td>
                                <td>$4,800</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-semibold text-blue-900 mb-2">💡 Финансовые рекомендации:</h4>
                        <ul class="text-sm text-blue-800 space-y-1">
                            <li>• Резервируйте 20-30% от выручки на инфраструктуру при росте</li>
                            <li>• Планируйте найм команды при достижении 5K+ пользователей</li>
                            <li>• Рассмотрите кредитные программы AWS/GCP для стартапов</li>
                            <li>• Инвестируйте в автоматизацию для снижения операционных расходов</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Роадмап -->
            <div id="roadmap" class="tab-content">
                <div class="card-content">
                    <h3 class="text-xl font-semibold mb-6">Фазы разработки</h3>
                    
                    <div class="space-y-6 mb-8">
                        <div class="roadmap-phase">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="text-lg font-semibold">Фаза 1: MVP и основной функционал</h4>
                                    <p class="text-sm text-gray-600">Q4 2023 - Q1 2024</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-success">Завершено</span>
                                    <span class="text-sm font-medium">100%</span>
                                </div>
                            </div>
                            <div class="progress-bar mb-3">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>Базовая архитектура проекта</span>
                                    </div>
                                    <span class="text-xs font-medium text-red-600">Критично</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>Система аутентификации</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>SEO аудит сайтов</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>Пользовательский интерфейс</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="roadmap-phase">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="text-lg font-semibold">Фаза 2: Улучшение производительности</h4>
                                    <p class="text-sm text-gray-600">Q2 2024 - Q3 2024</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-primary">В процессе</span>
                                    <span class="text-sm font-medium">75%</span>
                                </div>
                            </div>
                            <div class="progress-bar mb-3">
                                <div class="progress-fill" style="width: 75%"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>Анализ скорости загрузки</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>Мобильная оптимизация</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>Автоматическое исправление</span>
                                    </div>
                                    <span class="text-xs font-medium text-gray-600">Средний</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-check-circle text-green-500" style="font-size: 12px;"></i>
                                        <span>Улучшение UX/UI</span>
                                    </div>
                                    <span class="text-xs font-medium text-gray-600">Средний</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="roadmap-phase">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="text-lg font-semibold">Фаза 3: Расширенная аналитика</h4>
                                    <p class="text-sm text-gray-600">Q4 2024 - Q1 2025</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-warning">Запланировано</span>
                                    <span class="text-sm font-medium">0%</span>
                                </div>
                            </div>
                            <div class="progress-bar mb-3">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>Отслеживание позиций</span>
                                    </div>
                                    <span class="text-xs font-medium text-orange-600">Высокий</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>Анализ конкурентов</span>
                                    </div>
                                    <span class="text-xs font-medium text-gray-600">Средний</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>API для разработчиков</span>
                                    </div>
                                    <span class="text-xs font-medium text-gray-600">Средний</span>
                                </div>
                                <div class="flex items-center justify-between p-2 border border-gray-200 rounded text-sm">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; border: 1px solid #d1d5db; border-radius: 50%;"></div>
                                        <span>Расширенная аналитика</span>
                                    </div>
                                    <span class="text-xs font-medium text-gray-600">Средний</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-semibold mb-4">Ключевые вехи</h3>
                    <div class="space-y-4 mb-8">
                        <div class="milestone">
                            <div class="milestone-icon milestone-completed"></div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold">Запуск MVP</h4>
                                    <span class="badge badge-success">2024-01-15</span>
                                </div>
                                <p class="text-sm text-gray-600">Первая рабочая версия с базовым функционалом SEO-аудита</p>
                            </div>
                        </div>
                        
                        <div class="milestone">
                            <div class="milestone-icon milestone-completed"></div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold">Публичный релиз</h4>
                                    <span class="badge badge-success">2024-03-01</span>
                                </div>
                                <p class="text-sm text-gray-600">Открытие доступа для первых пользователей</p>
                            </div>
                        </div>
                        
                        <div class="milestone">
                            <div class="milestone-icon milestone-progress"></div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold">Мобильная версия</h4>
                                    <span class="badge badge-primary">2024-06-15</span>
                                </div>
                                <p class="text-sm text-gray-600">Полная адаптация под мобильные устройства</p>
                            </div>
                        </div>
                        
                        <div class="milestone">
                            <div class="milestone-icon milestone-planned"></div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold">API v1.0</h4>
                                    <span class="badge badge-warning">2024-09-01</span>
                                </div>
                                <p class="text-sm text-gray-600">Публичный API для интеграции с внешними сервисами</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div class="text-center p-4 border border-gray-200 rounded-lg">
                            <div class="text-2xl font-bold text-green-600 mb-2">6 месяцев</div>
                            <p class="text-sm text-gray-600">до полной готовности MVP</p>
                        </div>
                        <div class="text-center p-4 border border-gray-200 rounded-lg">
                            <div class="text-2xl font-bold text-blue-600 mb-2">18 месяцев</div>
                            <p class="text-sm text-gray-600">до Enterprise версии</p>
                        </div>
                        <div class="text-center p-4 border border-gray-200 rounded-lg">
                            <div class="text-2xl font-bold text-purple-600 mb-2">25+</div>
                            <p class="text-sm text-gray-600">запланированных функций</p>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-semibold text-blue-900 mb-2">🎯 Текущие приоритеты:</h4>
                        <ul class="text-sm text-blue-800 space-y-1">
                            <li>• Завершение мобильной оптимизации</li>
                            <li>• Реализация автоматического исправления ошибок</li>
                            <li>• Улучшение системы отчетов</li>
                            <li>• Оптимизация производительности</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {
            // Скрыть все вкладки
            const allTabs = document.querySelectorAll('.tab-content');
            allTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Убрать активный класс у всех кнопок
            const allButtons = document.querySelectorAll('.tab-button');
            allButtons.forEach(button => {
                button.classList.remove('active');
            });
            
            // Показать выбранную вкладку
            const selectedTab = document.getElementById(tabName);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Добавить активный класс к нажатой кнопке
            const clickedButton = event.target;
            clickedButton.classList.add('active');
        }
        
        // Анимация прогресс-баров при загрузке
        window.addEventListener('load', function() {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.opacity = '1';
                }, index * 200);
            });
        });
        
        // Плавная прокрутка к разделам
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seomarket-project-details.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Интерактивный HTML экспортирован успешно!');
  };

  const exportToPDF = () => {
    // PDF export functionality
    // For example, using jsPDF or similar library to generate PDF from content
    // Here is a simple placeholder implementation:

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('SeoMarket - Детали проекта', 10, 20);

      doc.setFontSize(12);
      doc.text('Полное техническое описание проекта, готовность к продакшн и стратегия масштабирования', 10, 30);

      // Add more detailed content here as needed, or generate from existing data

      doc.save('seomarket-project-details.pdf');
      toast.success('PDF отчет экспортирован успешно!');
    }).catch(() => {
      toast.error('Ошибка при экспорте PDF');
    });
  };

  return (
    <div className="flex gap-3">
      <Button 
        onClick={exportToHTML}
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        Интерактивный HTML
      </Button>
      <Button 
        onClick={exportToPDF}
        variant="outline" 
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF отчет
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Экспорт данных
      </Button>
    </div>
  );
};

export default ProjectExporter;
