import React from 'react';
import { Link } from 'react-router-dom';
import { Archive, CircleAlert, Database, EyeOff, KeyRound, Lock, ShieldCheck, UserCog } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { Blueprint, DocTitle, H2, IconPara, Kicker, Lead } from '@/site/docs/parts';

/**
 * «Безопасность и доступы» (макет, строки 246–275) — только меры, которые есть в коде.
 *
 * Есть:
 *  - доступы к хостингу клиентов не принимаются: прежняя админка хранила их в localStorage открытым
 *    текстом, раздел очищен (pages/admin/HostingPage.tsx, cabinet/admin/HostingTab.tsx);
 *  - RLS в Supabase: заявки читает только администратор и автор (миграция contact_requests и др.);
 *  - SSRF-защита обхода: supabase/functions/_shared/url-guard.ts — только http(s), частные и служебные
 *    диапазоны IPv4/IPv6 отсекаются, имя резолвится, каждый редирект проверяется заново (audit-processor);
 *  - ключи поставщиков (DeepSeek, Resend, XMLRiver) — секреты функций, не в браузере;
 *  - HTTPS: GitHub Pages и API Supabase.
 * Не переносим из макета: «наш SSH-ключ» (механизма нет), «доступы хранятся в шифрованном виде с
 * отдельным ключом» (их не храним вовсе), «двухфакторная аутентификация» (не включена — см.
 * cabinet/account/SecuritySection.tsx), «резервная копия 30 дней» и «проверка индексации превью
 * каждые шесть часов» (превью и установки нет).
 */

const Security: React.FC = () => (
  <DocsLayout current="security">
    <PageSeo
      title="Безопасность и доступы"
      description="Как SeoMarket обращается с доступами и данными: доступы к хостингу не принимаются и не хранятся, разграничение прав в базе, защита обхода от запросов во внутренние сети, HTTPS."
    />
    <Kicker>Безопасность</Kicker>
    <DocTitle>Безопасность и доступы</DocTitle>
    <Lead>
      Установка правок требует доступа к сайту — это главный риск, который вы берёте, работая с любым подрядчиком. Поэтому
      сервис сейчас устроен так, что доступы к вашему серверу ему не нужны и не передаются.
    </Lead>

    <div style={{ display: 'grid', gap: 'var(--space-4)', marginBottom: 32 }}>
      <Blueprint style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-heading)', fontSize: 20 }}>
            <KeyRound size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', color: 'var(--color-accent)' }} />
            Доступы не храним
          </span>
          <span className="tag tag-accent">Как сейчас</span>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
          В сервисе нет форм для паролей FTP, SSH или панели хостинга, и в базе нет полей для них. Прежняя версия админки
          сохраняла такие доступы в браузере открытым текстом — этот раздел удалён. Не присылайте пароли и в форме заявки.
        </p>
      </Blueprint>
      <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 8 }}>
          <Archive size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', color: 'var(--color-accent)' }} />
          Правки без доступа к серверу
        </span>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
          Предложенные title, description и тексты видны в кабинете рядом с исходными. Переносите их на сайт сами или
          силами своего разработчика — сервис вашего сервера не касается.
        </p>
      </div>
      <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 8 }}>
          <UserCog size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', color: 'var(--color-accent)' }} />
          Если договоримся об установке
        </span>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
          Установка правок силами сервиса пока не подключена. Когда понадобится, выдавайте временный доступ: отдельного
          пользователя с правами только на нужную папку, которого вы удалите сразу после работ.
        </p>
      </div>
    </div>

    <H2>Технические меры</H2>
    <IconPara icon={ShieldCheck}>
      Соединение с сайтом и с сервером сервиса идёт по HTTPS. Пароли учётных записей хранит служба входа Supabase — только
      в виде хешей, сам пароль сервис не видит.
    </IconPara>
    <IconPara icon={Database}>
      Доступ к данным в базе разграничен правилами на уровне строк (Row Level Security): аудиты и сметы вошедшего
      пользователя видит только он, заявки с сайта — только администратор. Проверки, запущенные без входа, ни к кому
      не привязаны и защищены слабее: для сайтов, которые не хотите показывать посторонним, запускайте аудит из кабинета. Ключи внешних сервисов — языковой модели, почты,
      поисковой выдачи — хранятся в секретах серверных функций и в браузер не попадают.
    </IconPara>
    <IconPara icon={Lock} mb={24}>
      Аудит обходит только публичные адреса по http и https. Адреса внутренних сетей, localhost и служебные диапазоны,
      включая адреса облачных метаданных, отклоняются; имя сайта перед обходом разрешается в IP-адреса, и проверяется
      каждый из них, а каждый переход по редиректу проверяется заново. Так аудит нельзя использовать, чтобы заглянуть во
      внутреннюю сеть сервиса.
    </IconPara>

    <H2>Чего пока нет</H2>
    <IconPara icon={CircleAlert}>
      Двухфакторного входа. Его можно включить технически, но защитой он станет, только когда вход будет требовать второй
      фактор на каждом шаге, — до этого не показываем его как работающий. В{' '}
      <Link to="/app/settings">настройках кабинета</Link> можно сменить пароль и завершить сессии на других устройствах.
    </IconPara>
    <IconPara icon={EyeOff} mb={0}>
      Превью исправленной копии сайта. Когда оно появится, копия будет закрыта от индексации: незакрытая копия стала бы
      дублем вашего сайта в выдаче.
    </IconPara>

  </DocsLayout>
);

export default Security;
