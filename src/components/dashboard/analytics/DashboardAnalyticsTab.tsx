
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardAnalyticsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
      <CardHeader>
        <CardTitle>Аналитика</CardTitle>
        <CardDescription>
          Детальная аналитика ваших проектов
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Нет доступных данных</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Запустите аудит сайта для получения аналитики
          </p>
          <Button className="mt-4" onClick={() => navigate('/audit')}>
            Запустить аудит
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsTab;
