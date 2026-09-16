import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Общие настройки сайта.
 *
 * Здесь были поля названия, описания, ключевых слов, контактов и соцсетей и
 * переключатель режима обслуживания. Введённое никуда не уходило: контакты —
 * это константа SITE_CONTACTS в коде, а хранилища настроек сайта нет. Админ
 * вписывал настоящий email и телефон, получал «Настройки сохранены», а страница
 * контактов оставалась пустой.
 *
 * Теперь раздел показывает, что сейчас указано, и где это менять.
 */
const valueOrEmpty = (value: string): string => value || 'не указан';

const GeneralSiteSettings: React.FC = () => {
  const address = [SITE_CONTACTS.streetAddress, SITE_CONTACTS.addressLocality]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Контакты на сайте</CardTitle>
          <CardDescription>
            Задаются в файле src/config/site-contacts.ts. Пустое поле на сайте и в разметке для
            поисковиков не выводится. После правки сайт нужно пересобрать и опубликовать.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.email)}</dd>
            <dt className="text-muted-foreground">Email отдела продаж</dt>
            <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.salesEmail)}</dd>
            <dt className="text-muted-foreground">Телефон</dt>
            <dd className="break-words">{valueOrEmpty(SITE_CONTACTS.telephone)}</dd>
            <dt className="text-muted-foreground">Адрес</dt>
            <dd className="break-words">{valueOrEmpty(address)}</dd>
            <dt className="text-muted-foreground">Соцсети</dt>
            <dd className="break-words">
              {SITE_CONTACTS.social.length > 0 ? SITE_CONTACTS.social.join(', ') : 'не указаны'}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Название, описание и режим обслуживания</CardTitle>
          <CardDescription>
            Заголовки и описания страниц задаются на самих страницах через компонент PageSeo.
            Общих ключевых слов сайта и режима технического обслуживания в сервисе нет.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default GeneralSiteSettings;
