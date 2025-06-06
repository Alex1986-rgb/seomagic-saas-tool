
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
  DollarSign,
  Target,
  AlertTriangle
} from 'lucide-react';

const ScalabilityPlanning: React.FC = () => {
  const scalingMilestones = [
    {
      users: "0-1K",
      revenue: "$0-5K/мес",
      infrastructure: "Текущая",
      cost: "$50/мес",
      features: ["Serverless функции", "PostgreSQL", "Базовое кеширование"],
      challenges: ["Оптимизация кода", "Базовый мониторинг"],
      timeline: "Q1 2024",
      status: "current"
    },
    {
      users: "1K-10K", 
      revenue: "$5K-50K/мес",
      infrastructure: "Улучшенная",
      cost: "$200/мес",
      features: ["Redis кеш", "CDN", "Read replicas", "Error tracking"],
      challenges: ["Производительность БД", "Кеширование стратегий"],
      timeline: "Q2-Q3 2024",
      status: "planned"
    },
    {
      users: "10K-100K",
      revenue: "$50K-500K/мес", 
      infrastructure: "Масштабируемая",
      cost: "$1K/мес",
      features: ["Микросервисы", "Auto-scaling", "Multiple regions"],
      challenges: ["Архитектурная сложность", "Команда разработчиков"],
      timeline: "Q4 2024 - Q2 2025",
      status: "future"
    },
    {
      users: "100K+",
      revenue: "$500K+/мес",
      infrastructure: "Enterprise",
      cost: "$5K+/мес", 
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

  const costAnalysis = [
    {
      category: "Хостинг и инфраструктура",
      current: "$30/мес",
      projected1K: "$80/мес",
      projected10K: "$400/мес",
      projected100K: "$2000/мес"
    },
    {
      category: "База данных",
      current: "$25/мес", 
      projected1K: "$60/мес",
      projected10K: "$300/мес",
      projected100K: "$1500/мес"
    },
    {
      category: "CDN и кеширование",
      current: "$0",
      projected1K: "$20/мес",
      projected10K: "$100/мес", 
      projected100K: "$500/мес"
    },
    {
      category: "Мониторинг и логи",
      current: "$0",
      projected1K: "$30/мес",
      projected10K: "$150/мес",
      projected100K: "$800/мес"
    },
    {
      category: "Команда разработки",
      current: "$0",
      projected1K: "$5000/мес",
      projected10K: "$15000/мес",
      projected100K: "$40000/мес"
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
                      <DollarSign className="h-4 w-4" />
                      {milestone.revenue}
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
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{milestone.cost}</span>
                      <span className="text-sm text-muted-foreground">примерная стоимость</span>
                    </div>
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

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Анализ затрат на масштабирование
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Категория</th>
                  <th className="text-center p-3 font-semibold">Сейчас</th>
                  <th className="text-center p-3 font-semibold">1K users</th>
                  <th className="text-center p-3 font-semibold">10K users</th>
                  <th className="text-center p-3 font-semibold">100K users</th>
                </tr>
              </thead>
              <tbody>
                {costAnalysis.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3 text-center">{item.current}</td>
                    <td className="p-3 text-center">{item.projected1K}</td>
                    <td className="p-3 text-center">{item.projected10K}</td>
                    <td className="p-3 text-center">{item.projected100K}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold bg-muted/50">
                  <td className="p-3">Итого месячные расходы</td>
                  <td className="p-3 text-center">$55</td>
                  <td className="p-3 text-center">$5,190</td>
                  <td className="p-3 text-center">$15,950</td>
                  <td className="p-3 text-center">$44,800</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Финансовые рекомендации:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Резервируйте 20-30% от выручки на инфраструктуру при росте</li>
              <li>• Планируйте найм команды при достижении 5K+ пользователей</li>
              <li>• Рассмотрите кредитные программы AWS/GCP для стартапов</li>
              <li>• Инвестируйте в автоматизацию для снижения операционных расходов</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Performance Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Целевые показатели производительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Текущие показатели:</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Время загрузки</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Одновременные пользователи</span>
                    <span className="text-sm font-medium">50</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-medium">150ms</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Целевые показатели:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Время загрузки</span>
                  <Badge variant="outline">< 1s</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Одновременные пользователи</span>
                  <Badge variant="outline">10,000+</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>API Response Time</span>
                  <Badge variant="outline">< 100ms</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Uptime</span>
                  <Badge variant="outline">99.9%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScalabilityPlanning;
