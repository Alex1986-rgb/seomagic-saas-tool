
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardReportsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
      <CardHeader>
        <CardTitle>Отчеты</CardTitle>
        <CardDescription>
          Ваши сохраненные отчеты и аудиты
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Нет сохраненных отчетов</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Ваши сохраненные отчеты будут отображаться здесь
          </p>
          <Button className="mt-4" onClick={() => navigate('/reports')}>
            Просмотреть все отчеты
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardReportsTab;
