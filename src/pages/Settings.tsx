
import React from 'react';
import Layout from '@/components/Layout';
import ClientSettings from '@/components/client/ClientSettings';
import PageSeo from '@/components/seo/PageSeo';

const Settings: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Настройки аккаунта: профиль, тема и уведомления"
        description="Имя в профиле, тема оформления и почтовые уведомления: какие письма присылать о готовых аудитах, оптимизации и новостях сервиса."
        noindex
      />
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Настройки</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Управление настройками вашего аккаунта и сервиса
          </p>
          
          <div className="neo-card p-6">
            <ClientSettings />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
