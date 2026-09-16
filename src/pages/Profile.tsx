
import React from 'react';
import ClientProfile from '@/components/client/ClientProfile';
import PageSeo from '@/components/seo/PageSeo';

const Profile: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Профиль пользователя: личные данные, доступ и настройки"
        description="Личные данные и смена пароля, почтовые уведомления, история аудитов, последние проверки позиций и готовые отчёты вашего аккаунта."
        noindex
      />
      <ClientProfile />
    </>
  );
};

export default Profile;
