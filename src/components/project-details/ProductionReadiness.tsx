
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Shield,
  Database,
  Globe,
  Zap,
  Monitor,
  FileText,
  Settings,
  Play,
  Download,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const ProductionReadiness: React.FC = () => {
  const productionModules = [
    {
      name: "pinger.py",
      title: "Пинг поисковых систем",
      description: "Автоматическое уведомление Google, Yandex, Bing о новых страницах",
      status: "ready",
      readiness: 100,
      category: "SEO Tools",
      icon: Search,
      action: () => handlePingSearchEngines()
    },
    {
      name: "positions_checker.py", 
      title: "Проверка позиций в поиске",
      description: "Отслеживание позиций сайта по ключевым словам",
      status: "ready",
      readiness: 95,
      category: "Analytics",
      icon: Monitor,
      action: () => handleCheckPositions()
    },
    {
      name: "report_generator.py",
      title: "Генератор отчетов",
      description: "Создание детальных PDF отчетов и аналитики",
      status: "ready", 
      readiness: 100,
      category: "Reports",
      icon: FileText,
      action: () => handleGenerateReport()
    },
    {
      name: "ssl_manager.py",
      title: "SSL сертификаты",
      description: "Автоматическое управление SSL сертификатами",
      status: "ready",
      readiness: 100,
      category: "Security",
      icon: Shield
    },
    {
      name: "performance_monitor.py",
      title: "Мониторинг производительности",
      description: "Отслеживание скорости загрузки и метрик",
      status: "ready",
      readiness: 90,
      category: "Performance",
      icon: Zap
    },
    {
      name: "backup_manager.py",
      title: "Система бэкапов",
      description: "Автоматическое резервное копирование",
      status: "ready",
      readiness: 85,
      category: "Infrastructure",
      icon: Database
    }
  ];

  const handlePingSearchEngines = async () => {
    toast.info("Запуск пинга поисковых систем...");
    
    // Имитация процесса пинга
    setTimeout(() => {
      toast.success("Поисковые системы уведомлены об обновлениях!");
    }, 2000);
  };

  const handleCheckPositions = async () => {
    toast.info("Проверка позиций в поисковых системах...");
    
    setTimeout(() => {
      toast.success("Позиции обновлены! Найдено 15 ключевых слов в топ-30");
    }, 3000);
  };

  const handleGenerateReport = async () => {
    toast.info("Генерация нового отчета...");
    
    setTimeout(() => {
      toast.success("Отчет готов! Скачивание начато.");
    }, 2500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100 border-green-200';
      case 'testing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'issues': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'testing': return <Play className="h-4 w-4 text-yellow-500" />;
      case 'issues': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const overallReadiness = Math.round(
    productionModules.reduce((sum, module) => sum + module.readiness, 0) / productionModules.length
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Готовность к продакшн
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overallReadiness}%</div>
              <div className="text-sm text-muted-foreground">Общая готовность</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {productionModules.filter(m => m.status === 'ready').length}
              </div>
              <div className="text-sm text-muted-foreground">Готовых модулей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12</div>
              <div className="text-sm text-muted-foreground">Серверов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Готовность к продакшн</span>
              <span>{overallReadiness}%</span>
            </div>
            <Progress value={overallReadiness} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Модули системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productionModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className={`p-4 border-2 rounded-lg ${getStatusColor(module.status)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <h4 className="font-semibold">{module.title}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {module.name}
                        </Badge>
                      </div>
                    </div>
                    {getStatusIcon(module.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {module.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Готовность</span>
                      <span>{module.readiness}%</span>
                    </div>
                    <Progress value={module.readiness} className="h-1" />
                  </div>

                  {module.action && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={module.action}
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Запустить
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Дополнительные действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handlePingSearchEngines}
            >
              <Search className="mr-2 h-4 w-4" />
              Пинг поисковых систем (pinger.py)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleCheckPositions}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Проверить позиции в поиске (positions_checker.py)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleGenerateReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Сгенерировать новый отчет
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Статус сервисов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">API сервер</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">Работает</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">База данных</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">Работает</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Очереди задач</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">Работает</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">SSL сертификаты</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">Активны</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CDN</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">Работает</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionReadiness;
