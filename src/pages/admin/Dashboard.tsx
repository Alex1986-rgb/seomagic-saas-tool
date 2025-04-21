
import React from 'react';
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
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Helmet>
        <title>Админ-панель | Дашборд</title>
      </Helmet>
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 flex items-center gap-6 border border-transparent shadow-2xl">
        <div className="bg-white/10 text-white rounded-full p-5 shadow-lg">
          <BarChart2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Панель администратора</h1>
          <p className="text-blue-100 font-medium">
            Мониторинг, аналитика и управление системой
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-indigo-600 via-violet-500 to-fuchsia-500 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/40 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Пользователи</h2>
              <p className="text-blue-100 text-sm mb-4 flex-grow">
                Управление аккаунтами и правами доступа
              </p>
              <Link to="/admin/users">
                <Button variant="secondary" className="w-full justify-between font-semibold">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-fuchsia-500 via-pink-400 to-red-400 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-fuchsia-400/40 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Аналитика</h2>
              <p className="text-pink-100 text-sm mb-4 flex-grow">
                Статистика и показатели использования
              </p>
              <Link to="/admin/analytics">
                <Button variant="secondary" className="w-full justify-between font-semibold">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-emerald-600 via-green-400 to-lime-300 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/40 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Аудиты</h2>
              <p className="text-lime-100 text-sm mb-4 flex-grow">
                История и результаты проведенных аудитов
              </p>
              <Link to="/admin/audits">
                <Button variant="secondary" className="w-full justify-between font-semibold">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-200 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-orange-400/40 flex items-center justify-center mb-4">
                <Server className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Хостинг</h2>
              <p className="text-amber-100 text-sm mb-4 flex-grow">
                Управление хостингами и публикация сайтов
              </p>
              <Link to="/admin/hosting">
                <Button variant="secondary" className="w-full justify-between font-semibold">
                  Перейти <ArrowUp className="h-4 w-4 rotate-45" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-violet-600 via-blue-400 to-cyan-400 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-cyan-400/40 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Сайты</h2>
              <p className="text-cyan-100 text-sm mb-4 flex-grow">
                Оптимизированные сайты и поддомены
              </p>
              <Link to="/admin/sites">
                <Button variant="secondary" className="w-full justify-between font-semibold">
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
