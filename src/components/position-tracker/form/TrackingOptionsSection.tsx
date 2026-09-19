
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FormData } from './schema';

interface TrackingOptionsSectionProps {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
}

export const TrackingOptionsSection: React.FC<TrackingOptionsSectionProps> = ({
  form,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div>
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Регион</FormLabel>
              <FormControl>
                <Input
                  placeholder="Москва"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Глубина поиска (до {field.value} результатов)</FormLabel>
              {/* Сервер проверяет не глубже 100 позиций: раньше шкала шла до 1000,
                  и выбранная глубина молча урезалась. */}
              <FormControl>
                <Slider
                  min={10}
                  max={100}
                  step={10}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Здесь был выбор «Частота сканирования» (ежедневно, еженедельно,
          ежемесячно). Проверок по расписанию нет, сервер частоту не получает,
          поэтому выбор убран: каждая проверка разовая. */}
      <div className="space-y-2">
        <p className="text-sm font-medium leading-none">Частота проверки</p>
        <p className="text-sm text-muted-foreground">
          Проверка разовая и запускается вручную. Регулярные проверки по расписанию пока не подключены.
        </p>
      </div>
    </div>
  );
};
