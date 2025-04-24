
import React from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from "@/components/ui/card";
import InteractiveTabsProcess from "./InteractiveTabsProcess";

const OptimizationProcessContainer: React.FC = () => {
  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <Helmet>
        <title>Процесс оптимизации | Админ-панель</title>
      </Helmet>
      
      <Card className="border-primary/10 shadow-lg">
        <CardContent className="p-6">
          <InteractiveTabsProcess />
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationProcessContainer;
