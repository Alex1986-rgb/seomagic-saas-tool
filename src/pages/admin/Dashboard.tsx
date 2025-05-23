
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Server,
  Globe,
  ArrowUp
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  useEffect(() => {
    console.log('Dashboard component mounted');
    return () => {
      console.log('Dashboard component unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Helmet>
        <title>Админ-панель | Дашборд</title>
      </Helmet>
      
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-500/20 to-indigo-600/20 flex items-center gap-6 border border-primary/20 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <BarChart2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Панель администратора</h1>
          <p className="text-muted-foreground">
            Мониторинг, аналитика и управление системой
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-all backdrop-blur-sm bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-blue-600/20 text-blue-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Пользователи</h2>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                Управление аккаунтами и правами доступа
              </p>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-between">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all backdrop-blur-sm bg-gradient-to-br from-purple-600/5 to-blue-600/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-purple-600/20 text-purple-600 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Аналитика</h2>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                Статистика и показатели использования
              </p>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-between">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all backdrop-blur-sm bg-gradient-to-br from-green-600/5 to-blue-600/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-green-600/20 text-green-600 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Аудиты</h2>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                История и результаты проведенных аудитов
              </p>
              <Link to="/admin/audits">
                <Button variant="outline" className="w-full justify-between">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all backdrop-blur-sm bg-gradient-to-br from-amber-600/5 to-orange-600/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-amber-600/20 text-amber-600 flex items-center justify-center mb-4">
                <Server className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Хостинг</h2>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                Управление хостингами и публикация сайтов
              </p>
              <Link to="/admin/hosting">
                <Button variant="outline" className="w-full justify-between">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all backdrop-blur-sm bg-gradient-to-br from-indigo-600/5 to-blue-600/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 text-indigo-600 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Сайты</h2>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                Оптимизированные сайты и поддомены
              </p>
              <Link to="/admin/sites">
                <Button variant="outline" className="w-full justify-between">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
