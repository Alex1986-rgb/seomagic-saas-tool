
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Search, 
  Zap, 
  Target,
  Users,
  BarChart3,
  Code,
  Shield
} from 'lucide-react';

const ProjectOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Обзор проекта SeoMarket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Описание проекта</h3>
              <p className="text-muted-foreground mb-4">
                SeoMarket - это автоматизированная платформа для SEO аудита и оптимизации сайтов. 
                Система выполняет глубокое сканирование сайтов, анализирует SEO параметры и создает 
                оптимизированную версию с исправленными HTML параметрами.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Готовность проекта</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Ключевые возможности</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Рекурсивное сканирование сайтов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">ИИ-оптимизация контента</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Автоматическое исправление HTML</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Публикация на продакшн</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-muted-foreground">Проанализированных сайтов</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Успешных оптимизаций</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Модулей системы</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Технологический стек
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Frontend</Badge>
              <div className="text-sm space-y-1">
                <div>React + TypeScript</div>
                <div>Tailwind CSS</div>
                <div>Framer Motion</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Backend</Badge>
              <div className="text-sm space-y-1">
                <div>Python + FastAPI</div>
                <div>Celery</div>
                <div>PostgreSQL</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">AI/ML</Badge>
              <div className="text-sm space-y-1">
                <div>OpenAI GPT</div>
                <div>Content Analysis</div>
                <div>SEO Optimization</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Infrastructure</Badge>
              <div className="text-sm space-y-1">
                <div>Beget VPS</div>
                <div>Docker</div>
                <div>Redis</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
