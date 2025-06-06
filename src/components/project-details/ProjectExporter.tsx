import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Globe, Printer } from 'lucide-react';

const ProjectExporter: React.FC = () => {
  const generateInteractiveHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoMarket - Детали проекта</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }
        
        /* Starry background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 100px 100px, 150px 150px, 200px 200px;
            animation: twinkle 20s infinite;
            z-index: 0;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .main-content {
            position: relative;
            z-index: 1;
            backdrop-filter: blur(3px);
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(31, 38, 135, 0.2);
        }
        
        .tab-active {
            background: rgba(255, 255, 255, 0.9);
            color: #1f2937;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .tab-inactive {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .tab-inactive:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .badge-success {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .badge-warning {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
        
        .badge-info {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .badge-secondary {
            background: rgba(107, 114, 128, 0.2);
            color: #6b7280;
            border: 1px solid rgba(107, 114, 128, 0.3);
        }
        
        .icon {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
        }
        
        .icon-lg {
            width: 24px;
            height: 24px;
        }
        
        .heading-1 {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.2;
            color: white;
        }
        
        .heading-2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.3;
            color: #1f2937;
        }
        
        .heading-3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.4;
            color: #374151;
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-scale {
            transition: transform 0.2s ease;
        }
        
        .hover-scale:hover {
            transform: scale(1.02);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .timeline-item {
            position: relative;
            padding-left: 2rem;
            border-left: 2px solid rgba(59, 130, 246, 0.3);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #3b82f6;
        }
        
        .text-muted {
            color: #6b7280;
        }
        
        .text-primary {
            color: #3b82f6;
        }
        
        .bg-muted {
            background: rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 768px) {
            .heading-1 {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .tabs-list {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="main-content">
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="text-center mb-12">
                    <h1 class="heading-1 mb-6">
                        SeoMarket - Детали проекта
                    </h1>
                    <p class="text-xl text-white opacity-90 max-w-3xl mx-auto mb-8">
                        Полное техническое описание проекта, готовность к продакшн и стратегия масштабирования
                    </p>
                    <div class="flex gap-4 justify-center">
                        <button onclick="exportToPDF()" class="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 flex items-center gap-2">
                            <i data-lucide="download" class="icon"></i>
                            Экспорт PDF
                        </button>
                        <button onclick="printPage()" class="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 flex items-center gap-2">
                            <i data-lucide="printer" class="icon"></i>
                            Печать
                        </button>
                    </div>
                </div>
                
                <!-- Main Card -->
                <div class="card p-6">
                    <!-- Tabs Navigation -->
                    <div class="flex flex-wrap gap-2 mb-8 tabs-list">
                        <button onclick="showTab('overview')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-active" data-tab="overview">
                            <i data-lucide="target" class="icon mr-2"></i>
                            Обзор
                        </button>
                        <button onclick="showTab('architecture')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-inactive" data-tab="architecture">
                            <i data-lucide="layers" class="icon mr-2"></i>
                            Архитектура
                        </button>
                        <button onclick="showTab('features')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-inactive" data-tab="features">
                            <i data-lucide="check-circle" class="icon mr-2"></i>
                            Статус функций
                        </button>
                        <button onclick="showTab('production')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-inactive" data-tab="production">
                            <i data-lucide="shield" class="icon mr-2"></i>
                            Продакшн
                        </button>
                        <button onclick="showTab('scaling')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-inactive" data-tab="scaling">
                            <i data-lucide="trending-up" class="icon mr-2"></i>
                            Масштабирование
                        </button>
                        <button onclick="showTab('roadmap')" class="tab-button px-4 py-2 rounded-lg transition-all duration-300 tab-inactive" data-tab="roadmap">
                            <i data-lucide="calendar" class="icon mr-2"></i>
                            Роадмап
                        </button>
                    </div>
                    
                    <!-- Tab Contents -->
                    
                    <!-- Overview Tab -->
                    <div id="overview" class="tab-content active fade-in">
                        <div class="space-y-8">
                            <!-- Project Summary -->
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="target" class="icon-lg text-primary"></i>
                                    Общая информация о проекте
                                </h2>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 class="heading-3 mb-4">О проекте SeoMarket</h3>
                                        <p class="text-muted mb-4">
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
                                        <h3 class="heading-3 mb-4">Ключевые особенности</h3>
                                        <ul class="space-y-2">
                                            <li class="flex items-center gap-2">
                                                <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                <span>Автоматический SEO-аудит</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                <span>ИИ-powered оптимизация</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                <span>Отслеживание позиций</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                <span>Детальная аналитика</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <i data-lucide="alert-circle" class="icon text-orange-500"></i>
                                                <span>Интеграция с CMS (в разработке)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Progress Overview -->
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="trending-up" class="icon-lg text-primary"></i>
                                    Прогресс разработки
                                </h2>
                                <div class="space-y-4">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-medium">Общая готовность</span>
                                            <span class="text-sm font-semibold text-green-600">85%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 85%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-medium">Frontend</span>
                                            <span class="text-sm font-semibold text-blue-600">90%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 90%; background: linear-gradient(90deg, #3b82f6, #60a5fa)"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-medium">Backend</span>
                                            <span class="text-sm font-semibold text-purple-600">80%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 80%; background: linear-gradient(90deg, #8b5cf6, #a78bfa)"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-medium">Тестирование</span>
                                            <span class="text-sm font-semibold text-orange-600">75%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 75%; background: linear-gradient(90deg, #f59e0b, #fbbf24)"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Key Metrics -->
                            <div class="stats-grid">
                                <div class="glass-card p-6 hover-scale">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm text-muted">Всего страниц</p>
                                            <p class="text-2xl font-bold">25+</p>
                                            <p class="text-xs text-green-600">+15%</p>
                                        </div>
                                        <i data-lucide="globe" class="icon-lg text-primary"></i>
                                    </div>
                                </div>
                                <div class="glass-card p-6 hover-scale">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm text-muted">Активных пользователей</p>
                                            <p class="text-2xl font-bold">150+</p>
                                            <p class="text-xs text-green-600">+25%</p>
                                        </div>
                                        <i data-lucide="users" class="icon-lg text-primary"></i>
                                    </div>
                                </div>
                                <div class="glass-card p-6 hover-scale">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm text-muted">Время загрузки</p>
                                            <p class="text-2xl font-bold">1.2s</p>
                                            <p class="text-xs text-green-600">-20%</p>
                                        </div>
                                        <i data-lucide="clock" class="icon-lg text-primary"></i>
                                    </div>
                                </div>
                                <div class="glass-card p-6 hover-scale">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-sm text-muted">Уровень безопасности</p>
                                            <p class="text-2xl font-bold">Высокий</p>
                                            <p class="text-xs text-green-600">+10%</p>
                                        </div>
                                        <i data-lucide="shield" class="icon-lg text-primary"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Architecture Tab -->
                    <div id="architecture" class="tab-content fade-in">
                        <div class="space-y-8">
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="layers" class="icon-lg text-primary"></i>
                                    Архитектурные слои
                                </h2>
                                <div class="space-y-6">
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="monitor" class="icon text-primary"></i>
                                                <h3 class="heading-3">Presentation Layer</h3>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="badge badge-success">Стабильно</span>
                                                <span class="text-sm text-muted">90%</span>
                                            </div>
                                        </div>
                                        <p class="text-muted mb-3">Пользовательский интерфейс и взаимодействие</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="badge badge-secondary">React 18</span>
                                            <span class="badge badge-secondary">TypeScript</span>
                                            <span class="badge badge-secondary">Tailwind CSS</span>
                                            <span class="badge badge-secondary">Framer Motion</span>
                                        </div>
                                    </div>
                                    
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="layers" class="icon text-primary"></i>
                                                <h3 class="heading-3">Business Logic Layer</h3>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="badge badge-success">Стабильно</span>
                                                <span class="text-sm text-muted">85%</span>
                                            </div>
                                        </div>
                                        <p class="text-muted mb-3">Бизнес-логика и управление состоянием</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="badge badge-secondary">React Hooks</span>
                                            <span class="badge badge-secondary">Context API</span>
                                            <span class="badge badge-secondary">React Query</span>
                                            <span class="badge badge-secondary">Custom Services</span>
                                        </div>
                                    </div>
                                    
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="cloud" class="icon text-primary"></i>
                                                <h3 class="heading-3">API Layer</h3>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="badge badge-success">Стабильно</span>
                                                <span class="text-sm text-muted">80%</span>
                                            </div>
                                        </div>
                                        <p class="text-muted mb-3">Слой взаимодействия с backend сервисами</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="badge badge-secondary">Supabase Client</span>
                                            <span class="badge badge-secondary">REST API</span>
                                            <span class="badge badge-secondary">Real-time Subscriptions</span>
                                        </div>
                                    </div>
                                    
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="database" class="icon text-primary"></i>
                                                <h3 class="heading-3">Data Layer</h3>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="badge badge-info">В разработке</span>
                                                <span class="text-sm text-muted">75%</span>
                                            </div>
                                        </div>
                                        <p class="text-muted mb-3">Хранение и управление данными</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="badge badge-secondary">PostgreSQL</span>
                                            <span class="badge badge-secondary">Supabase</span>
                                            <span class="badge badge-secondary">RLS Policies</span>
                                            <span class="badge badge-secondary">Migrations</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Features Tab -->
                    <div id="features" class="tab-content fade-in">
                        <div class="space-y-8">
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="bar-chart-3" class="icon-lg text-primary"></i>
                                    Общий прогресс разработки
                                </h2>
                                <div class="stats-grid mb-6">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-600">3</div>
                                        <div class="text-sm text-muted">Завершено</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-blue-600">4</div>
                                        <div class="text-sm text-muted">В процессе</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-orange-600">2</div>
                                        <div class="text-sm text-muted">Запланировано</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-gray-600">1</div>
                                        <div class="text-sm text-muted">Не начато</div>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 65%"></div>
                                </div>
                                <div class="text-center mt-2">
                                    <span class="text-lg font-bold text-primary">65% общий прогресс</span>
                                </div>
                            </div>
                            
                            <!-- Features by Category -->
                            <div class="glass-card p-6">
                                <h3 class="heading-3 mb-4">Аудит</h3>
                                <div class="space-y-4">
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="search" class="icon text-primary"></i>
                                                <div>
                                                    <h4 class="font-semibold">Полное сканирование сайта</h4>
                                                    <p class="text-sm text-muted">Глубокий анализ всех страниц сайта для обнаружения SEO проблем</p>
                                                </div>
                                            </div>
                                            <div class="flex flex-col gap-2 items-end">
                                                <div class="flex items-center gap-2">
                                                    <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                    <span class="badge badge-success">Завершено</span>
                                                </div>
                                                <span class="badge badge-warning">Высокий приоритет</span>
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="flex justify-between text-sm">
                                                <span>Прогресс: 100%</span>
                                                <span>40/40 часов</span>
                                            </div>
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: 100%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="p-4 border rounded-lg">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="file-text" class="icon text-primary"></i>
                                                <div>
                                                    <h4 class="font-semibold">Анализ метаданных</h4>
                                                    <p class="text-sm text-muted">Проверка тегов title, description и других метаданных</p>
                                                </div>
                                            </div>
                                            <div class="flex flex-col gap-2 items-end">
                                                <div class="flex items-center gap-2">
                                                    <i data-lucide="check-circle" class="icon text-green-500"></i>
                                                    <span class="badge badge-success">Завершено</span>
                                                </div>
                                                <span class="badge badge-warning">Высокий приоритет</span>
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="flex justify-between text-sm">
                                                <span>Прогресс: 95%</span>
                                                <span>19/20 часов</span>
                                            </div>
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: 95%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Production Tab -->
                    <div id="production" class="tab-content fade-in">
                        <div class="space-y-8">
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="shield" class="icon-lg text-primary"></i>
                                    Готовность к продакшн
                                </h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-4">
                                        <h3 class="heading-3">Безопасность</h3>
                                        <div class="space-y-3">
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">HTTPS принудительно</h4>
                                                    <p class="text-sm text-muted">Все соединения защищены SSL</p>
                                                </div>
                                                <span class="badge badge-success">Внедрено</span>
                                            </div>
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">Аутентификация JWT</h4>
                                                    <p class="text-sm text-muted">Безопасная система входа</p>
                                                </div>
                                                <span class="badge badge-success">Внедрено</span>
                                            </div>
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">Rate Limiting</h4>
                                                    <p class="text-sm text-muted">Защита от DDoS атак</p>
                                                </div>
                                                <span class="badge badge-secondary">Планируется</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <h3 class="heading-3">Производительность</h3>
                                        <div class="space-y-3">
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">CDN</h4>
                                                    <p class="text-sm text-muted">Глобальная доставка контента</p>
                                                </div>
                                                <span class="badge badge-success">Настроено</span>
                                            </div>
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">Gzip сжатие</h4>
                                                    <p class="text-sm text-muted">Оптимизация размера файлов</p>
                                                </div>
                                                <span class="badge badge-success">Активно</span>
                                            </div>
                                            <div class="flex items-center gap-3 p-3 border rounded-lg">
                                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium">Кеширование</h4>
                                                    <p class="text-sm text-muted">Оптимизация запросов</p>
                                                </div>
                                                <span class="badge badge-warning">Настройка</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Scaling Tab -->
                    <div id="scaling" class="tab-content fade-in">
                        <div class="space-y-8">
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="trending-up" class="icon-lg text-primary"></i>
                                    Дорожная карта масштабирования
                                </h2>
                                <div class="space-y-6">
                                    <div class="p-6 border-2 border-green-200 rounded-lg bg-green-50">
                                        <div class="flex justify-between items-center mb-4">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="users" class="icon"></i>
                                                <h3 class="text-xl font-bold">0-1K пользователей</h3>
                                                <span class="badge badge-success">Текущее состояние</span>
                                            </div>
                                            <div class="flex gap-4 text-sm">
                                                <span class="flex items-center gap-1">
                                                    <i data-lucide="dollar-sign" class="icon"></i>
                                                    $0-5K/мес
                                                </span>
                                                <span class="flex items-center gap-1">
                                                    <i data-lucide="clock" class="icon"></i>
                                                    Q1 2024
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            <div>
                                                <h4 class="font-semibold mb-2">Ключевые технологии:</h4>
                                                <ul class="text-sm space-y-1">
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        Serverless функции
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        PostgreSQL
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        Базовое кеширование
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 class="font-semibold mb-2">Основные вызовы:</h4>
                                                <ul class="text-sm space-y-1">
                                                    <li class="flex items-center gap-2">
                                                        <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                                        Оптимизация кода
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                                        Базовый мониторинг
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 class="font-semibold mb-2">Инфраструктура:</h4>
                                                <p class="text-sm mb-2">Текущая</p>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-lg font-bold">$50/мес</span>
                                                    <span class="text-sm text-muted">примерная стоимость</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                                        <div class="flex justify-between items-center mb-4">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="users" class="icon"></i>
                                                <h3 class="text-xl font-bold">1K-10K пользователей</h3>
                                                <span class="badge badge-info">Запланировано</span>
                                            </div>
                                            <div class="flex gap-4 text-sm">
                                                <span class="flex items-center gap-1">
                                                    <i data-lucide="dollar-sign" class="icon"></i>
                                                    $5K-50K/мес
                                                </span>
                                                <span class="flex items-center gap-1">
                                                    <i data-lucide="clock" class="icon"></i>
                                                    Q2-Q3 2024
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            <div>
                                                <h4 class="font-semibold mb-2">Ключевые технологии:</h4>
                                                <ul class="text-sm space-y-1">
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        Redis кеш
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        CDN
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        Read replicas
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <div class="w-1.5 h-1.5 bg-current rounded-full"></div>
                                                        Error tracking
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 class="font-semibold mb-2">Основные вызовы:</h4>
                                                <ul class="text-sm space-y-1">
                                                    <li class="flex items-center gap-2">
                                                        <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                                        Производительность БД
                                                    </li>
                                                    <li class="flex items-center gap-2">
                                                        <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                                        Кеширование стратегий
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 class="font-semibold mb-2">Инфраструктура:</h4>
                                                <p class="text-sm mb-2">Улучшенная</p>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-lg font-bold">$200/мес</span>
                                                    <span class="text-sm text-muted">примерная стоимость</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Roadmap Tab -->
                    <div id="roadmap" class="tab-content fade-in">
                        <div class="space-y-8">
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="calendar" class="icon-lg text-primary"></i>
                                    Фазы разработки
                                </h2>
                                <div class="space-y-6">
                                    <div class="relative timeline-item">
                                        <div class="flex gap-4">
                                            <div class="flex-grow">
                                                <div class="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h3 class="heading-3">Фаза 1: MVP и основной функционал</h3>
                                                        <p class="text-sm text-muted">Q4 2023 - Q1 2024</p>
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
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">Базовая архитектура проекта</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-red-600">Критично</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">Система аутентификации</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-orange-600">Высокий</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">SEO аудит сайтов</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-orange-600">Высокий</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">Пользовательский интерфейс</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-orange-600">Высокий</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="relative timeline-item">
                                        <div class="flex gap-4">
                                            <div class="flex-grow">
                                                <div class="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h3 class="heading-3">Фаза 2: Улучшение производительности</h3>
                                                        <p class="text-sm text-muted">Q2 2024 - Q3 2024</p>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="badge badge-info">В процессе</span>
                                                        <span class="text-sm font-medium">75%</span>
                                                    </div>
                                                </div>
                                                <div class="progress-bar mb-3">
                                                    <div class="progress-fill" style="width: 75%; background: linear-gradient(90deg, #3b82f6, #60a5fa)"></div>
                                                </div>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">Анализ скорости загрузки</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-orange-600">Высокий</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <div class="w-3 h-3 rounded-full border border-gray-300"></div>
                                                            <span>Мобильная оптимизация</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-orange-600">Высокий</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <div class="w-3 h-3 rounded-full border border-gray-300"></div>
                                                            <span>Автоматическое исправление</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-yellow-600">Средний</span>
                                                    </div>
                                                    <div class="flex items-center justify-between p-2 border rounded text-sm">
                                                        <div class="flex items-center gap-2">
                                                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i>
                                                            <span class="line-through text-muted">Улучшение UX/UI</span>
                                                        </div>
                                                        <span class="text-xs font-medium text-yellow-600">Средний</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Key Milestones -->
                            <div class="glass-card p-6">
                                <h2 class="heading-2 mb-4 flex items-center gap-2">
                                    <i data-lucide="target" class="icon-lg text-primary"></i>
                                    Ключевые вехи
                                </h2>
                                <div class="space-y-4">
                                    <div class="flex items-center gap-4 p-4 border rounded-lg">
                                        <i data-lucide="check-circle" class="icon text-green-500"></i>
                                        <div class="flex-grow">
                                            <div class="flex items-center justify-between">
                                                <h3 class="font-semibold">Запуск MVP</h3>
                                                <span class="badge badge-success">2024-01-15</span>
                                            </div>
                                            <p class="text-sm text-muted">Первая рабочая версия с базовым функционалом SEO-аудита</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-4 p-4 border rounded-lg">
                                        <i data-lucide="check-circle" class="icon text-green-500"></i>
                                        <div class="flex-grow">
                                            <div class="flex items-center justify-between">
                                                <h3 class="font-semibold">Публичный релиз</h3>
                                                <span class="badge badge-success">2024-03-01</span>
                                            </div>
                                            <p class="text-sm text-muted">Открытие доступа для первых пользователей</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-4 p-4 border rounded-lg">
                                        <i data-lucide="clock" class="icon text-blue-500"></i>
                                        <div class="flex-grow">
                                            <div class="flex items-center justify-between">
                                                <h3 class="font-semibold">Мобильная версия</h3>
                                                <span class="badge badge-info">2024-06-15</span>
                                            </div>
                                            <p class="text-sm text-muted">Полная адаптация под мобильные устройства</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-4 p-4 border rounded-lg">
                                        <i data-lucide="target" class="icon text-orange-500"></i>
                                        <div class="flex-grow">
                                            <div class="flex items-center justify-between">
                                                <h3 class="font-semibold">API v1.0</h3>
                                                <span class="badge badge-warning">2024-09-01</span>
                                            </div>
                                            <p class="text-sm text-muted">Публичный API для интеграции с внешними сервисами</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Tab functionality
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tab buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.classList.remove('tab-active');
                button.classList.add('tab-inactive');
            });
            
            // Show selected tab content
            const selectedTab = document.getElementById(tabName);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Add active class to clicked tab button
            const activeButton = document.querySelector(\`[data-tab="\${tabName}"]\`);
            if (activeButton) {
                activeButton.classList.remove('tab-inactive');
                activeButton.classList.add('tab-active');
            }
            
            // Re-initialize icons for the new content
            setTimeout(() => {
                lucide.createIcons();
            }, 100);
        }
        
        // Export to PDF functionality
        function exportToPDF() {
            alert('Функция экспорта в PDF будет доступна в полной версии приложения');
        }
        
        // Print functionality
        function printPage() {
            window.print();
        }
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize icons
            lucide.createIcons();
            
            // Add click handlers to tab buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');
                    showTab(tabName);
                });
            });
            
            // Add hover effects to cards
            const cards = document.querySelectorAll('.hover-scale');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Animate progress bars
            setTimeout(() => {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }, 500);
        });
        
        // Add smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '6') {
                const tabs = ['overview', 'architecture', 'features', 'production', 'scaling', 'roadmap'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) {
                    showTab(tabs[tabIndex]);
                }
            }
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
  };

  const exportPDF = () => {
    alert('Функция экспорта в PDF будет доступна в полной версии приложения');
  };

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <Button 
        onClick={generateInteractiveHTML}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <Globe className="h-4 w-4" />
        Интерактивный HTML
      </Button>
      
      <Button 
        onClick={exportPDF}
        className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
      >
        <Download className="h-4 w-4" />
        Экспорт PDF
      </Button>

      <Button 
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-accent hover:bg-accent/90"
      >
        <Printer className="h-4 w-4" />
        Печать
      </Button>
    </div>
  );
};

export default ProjectExporter;
