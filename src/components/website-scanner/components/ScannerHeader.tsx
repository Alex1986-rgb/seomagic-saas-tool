
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ScannerHeader = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-2xl">Сканирование сайта</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Введите URL сайта для начала сканирования и создания карты сайта (sitemap)
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ScannerHeader;
