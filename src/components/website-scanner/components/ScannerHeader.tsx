
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ScannerHeader = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сканирование сайта</CardTitle>
        <CardDescription>
          Введите URL сайта для начала сканирования и создания карты сайта (sitemap)
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ScannerHeader;
