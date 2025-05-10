
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const OptimizationProcessContainer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Процесс оптимизации</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Здесь будет отображаться прогресс оптимизации вашего сайта после оплаты и начала работ.
        </p>
      </CardContent>
    </Card>
  );
};
