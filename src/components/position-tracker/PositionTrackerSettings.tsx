import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface PositionTrackerSettingsProps {
  onClose?: () => void;
}

/**
 * Раньше здесь были «Настройки трекера позиций»: переключатель «Использовать
 * прокси», сбор и проверка прокси из браузера, ключи сервисов обхода капчи и
 * интервал «автоматических проверок». На проверку ничего из этого не влияло:
 * позиции снимает сервер (edge-функция positions-check) через внешнего
 * поставщика выдачи, а проверок по расписанию нет. Вместо имитации настроек
 * честно говорим, как устроена проверка.
 */
export const PositionTrackerSettings: React.FC<PositionTrackerSettingsProps> = ({ onClose }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Как проверяются позиции
        </CardTitle>
        <CardDescription>
          Настраивать в браузере нечего
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Выдачу запрашивает сервер через внешнего поставщика поисковой выдачи.
          Прокси, ключи сервисов обхода капчи и другие настройки браузера на
          проверку не влияют.
        </p>
        <p>
          Поисковую систему, регион и глубину проверки задайте в форме проверки.
          Проверка запускается вручную: регулярных проверок по расписанию пока нет.
        </p>

        {onClose && (
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionTrackerSettings;
