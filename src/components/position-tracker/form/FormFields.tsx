
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  domain: z.string().min(1, { message: "Домен обязателен для заполнения" }).url({ message: "Введите корректный URL" }),
  searchEngine: z.enum(["google", "yandex", "mailru", "all"]),
  region: z.string().optional(),
  keywords: z.array(z.string()).min(1, { message: "Добавьте хотя бы один ключевой запрос" }),
  depth: z.number().min(10).max(100),
  useProxy: z.boolean().default(false),
  scanFrequency: z.enum(["once", "daily", "weekly", "monthly"]).default("once"),
});

type FormData = z.infer<typeof formSchema>;

interface FormFieldsProps {
  form: UseFormReturn<FormData>;
}

export const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Домен для проверки</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
            <FormDescription>
              Введите URL сайта, позиции которого хотите проверить
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <FormField
          control={form.control}
          name="searchEngine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Поисковая система</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите поисковик" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Все поисковики</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="yandex">Яндекс</SelectItem>
                  <SelectItem value="mailru">Mail.ru</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Регион (опционально)</FormLabel>
              <FormControl>
                <Input placeholder="Москва" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Глубина проверки</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormDescription>
                Количество позиций для проверки (10-100)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scanFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Частота проверки</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите частоту" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="once">Однократно</SelectItem>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={form.control}
          name="useProxy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Использовать прокси
                </FormLabel>
                <FormDescription>
                  Помогает обойти ограничения поисковых систем
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export { formSchema };
export type { FormData };
