import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Общие настройки.
 *
 * Здесь были поля «Название сайта», «URL сайта» (с несуществующим
 * https://seomarket.ru), «Email администратора», «Контактный Email», «Описание
 * сайта», переключатель «Режим технического обслуживания» и кнопка, которая
 * через 0,8 секунды таймера отвечала «Настройки сохранены». Ничего не
 * записывалось: хранилища настроек сайта нет, а режима обслуживания в сервисе
 * не существует.
 *
 * Эти значения живут в коде, поэтому показываем, что там сейчас, и где их менять.
 */
const valueOrEmpty = (value: string): string => value || 'не указан';

const GeneralSettings: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Info className="h-5 w-5 text-muted-foreground" />
        Общие настройки задаются в коде сайта
      </CardTitle>
      <CardDescription>
        Сохранять их из админки некуда, поэтому формы здесь нет — только текущие значения.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4 text-sm">
      <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
        <dt className="text-muted-foreground">Контактный email</dt>
        <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.email)}</dd>
        <dt className="text-muted-foreground">Email отдела продаж</dt>
        <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.salesEmail)}</dd>
        <dt className="text-muted-foreground">Телефон</dt>
        <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.telephone)}</dd>
      </dl>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        <li>контакты, адрес и соцсети — в файле src/config/site-contacts.ts;</li>
        <li>название сервиса в заголовках страниц — в src/components/seo/PageSeo.tsx;</li>
        <li>режима технического обслуживания в сервисе нет.</li>
      </ul>
      <p className="text-muted-foreground">
        После правки файлов сайт нужно пересобрать и опубликовать заново.
      </p>
    </CardContent>
  </Card>
);

export default GeneralSettings;
