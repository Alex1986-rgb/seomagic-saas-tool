
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

const DashboardProjectsTab: React.FC = () => {
  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Проекты</CardTitle>
            <CardDescription>
              Управление вашими проектами
            </CardDescription>
          </div>
          <Button size="sm">
            Добавить проект
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {['example.com', 'mysite.ru', 'business.org'].map((site, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{site}</h3>
                  <p className="text-sm text-muted-foreground">
                    Последнее сканирование: {i+1} дн. назад
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Управление
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsTab;
