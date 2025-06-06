
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Database, 
  Server, 
  Globe, 
  Users, 
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

const ProjectOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Frontend</h3>
            <Progress value={85} className="mb-2" />
            <p className="text-sm text-muted-foreground">85% готово</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Server className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Backend</h3>
            <Progress value={60} className="mb-2" />
            <p className="text-sm text-muted-foreground">60% готово</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Database</h3>
            <Progress value={75} className="mb-2" />
            <p className="text-sm text-muted-foreground">75% готово</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Security</h3>
            <Progress value={70} className="mb-2" />
            <p className="text-sm text-muted-foreground">70% готово</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Описание проекта
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              SeoMarket - это комплексная SaaS-платформа для SEO-аудита и оптимизации сайтов. 
              Проект включает в себя инструменты для анализа сайта, отслеживания позиций, 
              автоматической оптимизации и детальной отчетности.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Ключевые особенности:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Полнофункциональный SEO-аудит сайтов</li>
                <li>ИИ-powered оптимизация контента</li>
                <li>Отслеживание позиций в реальном времени</li>
                <li>Административная панель с аналитикой</li>
                <li>Система пользователей и подписок</li>
                <li>Интеграция с внешними API</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Технические характеристики
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">React 18.3</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">TypeScript 5.0</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tailwind CSS</span>
                <Badge variant="secondary">Готово</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Supabase Backend</span>
                <Badge variant="outline">В разработке</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Edge Functions</span>
                <Badge variant="outline">В разработке</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Integration</span>
                <Badge variant="destructive">Не начато</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Общий прогресс проекта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Общая готовность</span>
                <span className="text-sm text-muted-foreground">72%</span>
              </div>
              <Progress value={72} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">147</div>
                <div className="text-sm text-muted-foreground">Готовых компонентов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">38</div>
                <div className="text-sm text-muted-foreground">В разработке</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">23</div>
                <div className="text-sm text-muted-foreground">Не начато</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
