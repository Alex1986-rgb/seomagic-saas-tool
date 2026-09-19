import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

/**
 * Кнопка сохранения контента.
 *
 * Раньше она вызывала переданный onSave и через 0,8 секунды таймера показывала
 * тост «Настройки сохранены. Изменения содержимого сайта успешно сохранены» —
 * хотя ни один раздел, где она стояла, ничего не записывал. Хранилища контента
 * и настроек сайта нет, поэтому кнопка выключена и прямо говорит об этом.
 * Разделы «Управление сайтом» и «Контент» её больше не используют.
 */
const SaveContentButton: React.FC = () => (
  <div className="flex flex-col items-end gap-1">
    <Button className="gap-2" disabled>
      <Save className="h-4 w-4" />
      <span>Сохранение не подключено</span>
    </Button>
    <span className="text-xs text-muted-foreground">
      Хранилища контента нет: правки пропадут после перезагрузки.
    </span>
  </div>
);

export default SaveContentButton;
