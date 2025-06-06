
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Database, 
  Zap,
  Globe,
  Settings,
  BarChart3,
  Clock,
  Target,
  AlertTriangle,
  Server,
  Shield
} from 'lucide-react';

const ScalabilityPlanning: React.FC = () => {
  const scalingMilestones = [
    {
      users: "0-1K",
      traffic: "До 10K запросов/день",
      infrastructure: "Базовая",
      features: ["Serverless функции", "PostgreSQL", "Базовое кеширование"],
      challenges: ["Оптимизация кода", "Базовый мониторинг"],
      timeline: "Q1 2024",
      status: "current"
    },
    {
      users: "1K-10K", 
      traffic: "До 100K запросов/день",
      infrastructure: "Улучшенная",
      features: ["Redis кеш", "CDN", "Read replicas", "Error tracking"],
      challenges: ["Производительность БД", "Кеширование стратегий"],
      timeline: "Q2-Q3 2024",
      status: "planned"
    },
    {
      users: "10K-100K",
      traffic: "До 1M запросов/день", 
      infrastructure: "Масштабируемая",
      features: ["Микросервисы", "Auto-scaling", "Multiple regions"],
      challenges: ["Архитектурная сложность", "Команда разработчиков"],
      timeline: "Q4 2024 - Q2 2025",
      status: "future"
    },
    {
      users: "100K+",
      traffic: "Свыше 1M запросов/день",
      infrastructure: "Enterprise",
      features: ["Шардинг БД", "Dedicated infrastructure", "Advanced monitoring"],
      challenges: ["Организационные процессы", "Compliance"],
      timeline: "2025+",
      status: "vision"
    }
  ];

  const technicalScalingAreas = [
    {
      area: "База данных",
      current: "PostgreSQL на Supabase",
      improvements: [
        { stage: "1K users", action: "Query optimization, indices" },
        { stage: "10K users", action: "Read replicas, connection pooling" },
        { stage: "100K users", action: "Шардинг, multiple DB instances" }
      ]
    },
    {
      area: "Frontend", 
      current: "React SPA",
      improvements: [
        { stage: "1K users", action: "Code splitting, lazy loading" },
        { stage: "10K users", action: "CDN, advanced caching" },
        { stage: "100K users", action: "Multiple regions, edge computing" }
      ]
    },
    {
      area: "API",
      current: "Supabase Edge Functions",
      improvements: [
        { stage: "1K users", action: "Rate limiting, monitoring" },
        { stage: "10K users", action: "API versioning, load balancing" },
        { stage: "100K users", action: "Микросервисы, API gateway" }
      ]
    },
    {
      area: "Безопасность",
      current: "Supabase Auth + RLS",
      improvements: [
        { stage: "1K users", action: "Advanced auth policies" },
        { stage: "10K users", action: "WAF, DDoS protection" },
        { stage: "100K users", action: "Security audits, compliance" }
      ]
    }
  ];

  const performanceMetrics = [
    { 
      category: "Производительность",
      metrics: [
        { name: "Время загрузки", current: "1.2s", target: "&lt; 1s" },
        { name: "API Response", current: "150ms", target: "&lt; 100ms" },
        { name: "Throughput", current: "500 RPS", target: "5000 RPS" }
      ]
    },
    {
      category: "Надежность", 
      metrics: [
        { name: "Uptime", current: "99.5%", target: "99.9%" },
        { name: "Error Rate", current: "0.1%", target: "&lt; 0.01%" },
        { name: "Recovery Time", current: "5 min", target: "&lt; 1 min" }
      ]
    },
    {
      category: "Масштабируемость",
      metrics: [
        { name: "Concurrent Users", current: "100", target: "10,000" },
        { name: "DB Connections", current: "50", target: "1000" },
        { name: "Memory Usage", current: "512MB", target: "Elastic" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'future': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vision': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return 'Текущее состояние';
      case 'planned': return 'Запланировано';
      case 'future': return 'Будущее развитие';
      case 'vision': return 'Долгосрочная цель';
      default: return 'Неопределено';
    }
  };

  return (
    <div className="space-y-8">
      {/* Scaling Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Дорожная карта масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scalingMilestones.map((milestone, index) => (
              <div key={index} className={`p-6 border-2 rounded-lg ${getStatusColor(milestone.status)}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div className="flex items-center gap-3 mb-2 lg:mb-0">
                    <Users className="h-5 w-5" />
                    <h3 className="text-xl font-bold">{milestone.users} пользователей</h3>
                    <Badge variant="outline">{getStatusLabel(milestone.status)}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {milestone.traffic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {milestone.timeline}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ключевые технологии:</h4>
                    <ul className="text-sm space-y-1">
                      {milestone.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Основные вызовы:</h4>
                    <ul className="text-sm space-y-1">
                      {milestone.challenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Инфраструктура:</h4>
                    <p className="text-sm mb-2">{milestone.infrastructure}</p>
                    <Badge variant="secondary">
                      {milestone.infrastructure} уровень
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Scaling Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Технические области масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {technicalScalingAreas.map((area, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{area.area}</h3>
                  <Badge variant="outline">Текущее: {area.current}</Badge>
                </div>
                
                <div className="space-y-3">
                  {area.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-muted/30 rounded-md">
                      <Badge variant="secondary" className="min-w-fit">
                        {improvement.stage}
                      </Badge>
                      <span className="text-sm">{improvement.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Метрики производительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((category, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-center">{category.category}</h4>
                <div className="space-y-3">
                  {category.metrics.map((metric, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span className="text-muted-foreground">{metric.current} → {metric.target}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Инфраструктурная стратегия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Этап 1: Базовая инфраструктура</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Serverless функции (Vercel/Netlify)</li>
                <li>• PostgreSQL (Supabase)</li>
                <li>• Статический контент через CDN</li>
                <li>• Базовый мониторинг</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Этап 2: Масштабирование</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Redis для кеширования</li>
                <li>• Load balancer</li>
                <li>• Read replicas БД</li>
                <li>• Advanced monitoring</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Этап 3: Энтерпрайз</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Микросервисная архитектура</li>
                <li>• Kubernetes</li>
                <li>• Multi-region deployment</li>
                <li>• Advanced security</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность и соответствие
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Текущие меры</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• SSL/TLS шифрование</li>
                <li>• Supabase Authentication</li>
                <li>• Row Level Security (RLS)</li>
                <li>• CORS защита</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Планируемые улучшения</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Web Application Firewall (WAF)</li>
                <li>• DDoS защита</li>
                <li>• Penetration testing</li>
                <li>• GDPR compliance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Мониторинг безопасности</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Security logs анализ</li>
                <li>• Intrusion detection</li>
                <li>• Vulnerability scanning</li>
                <li>• Incident response plan</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Целевая архитектура
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Multi-Region</h4>
              <p className="text-sm text-muted-foreground">Развертывание в нескольких регионах</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h4 className="font-semibold mb-1">Auto-scaling</h4>
              <p className="text-sm text-muted-foreground">Автоматическое масштабирование</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Distributed DB</h4>
              <p className="text-sm text-muted-foreground">Распределенная база данных</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h4 className="font-semibold mb-1">Zero-trust</h4>
              <p className="text-sm text-muted-foreground">Архитектура нулевого доверия</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScalabilityPlanning;
