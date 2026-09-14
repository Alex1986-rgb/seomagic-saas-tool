import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Globe, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Блок о трекинге позиций на главной странице.
 *
 * Раньше здесь стояли четыре вкладки с имитациями: «Позиции» показывали
 * проверку уникальности, а битые ссылки, структура и дубликаты выдавали
 * заранее написанные результаты для любого домена. Настоящие данные такого
 * рода собирает аудит сайта, а позиции проверяются в своём разделе — туда и
 * ведём, вместо того чтобы показывать выдуманное.
 */
const PositionTrackerFeature: React.FC = () => {
  const navigate = useNavigate();

  const points = [
    {
      icon: <Globe className="h-5 w-5 text-primary" />,
      title: 'Яндекс и Google',
      text: 'Проверка по нужному региону — от Москвы до другой страны.',
    },
    {
      icon: <BarChart className="h-5 w-5 text-primary" />,
      title: 'Настоящая выдача',
      text: 'Позиция берётся из поисковой выдачи, а не рассчитывается по формуле.',
    },
    {
      icon: <Repeat className="h-5 w-5 text-primary" />,
      title: 'История проверок',
      text: 'Каждая проверка сохраняется — видно, куда двигается сайт.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Отслеживание позиций сайта</h2>
        <p className="text-muted-foreground">
          Где ваш сайт находится по важным запросам — сегодня и месяц назад
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <Card key={point.title}>
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {point.icon}
              </div>
              <CardTitle className="text-base">{point.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{point.text}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button className="gap-2" onClick={() => navigate('/position-tracker')}>
          Проверить позиции
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => navigate('/audit')}>
          Сделать аудит сайта
        </Button>
      </div>
    </div>
  );
};

export default PositionTrackerFeature;
