
import React from 'react';
import ClientProfile from '@/components/client/ClientProfile';
import PageSeo from '@/components/seo/PageSeo';

const Profile: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Профиль пользователя: личные данные, доступ и настройки"
        description="Измените имя, почту и пароль, настройте уведомления и посмотрите сведения о своей подписке, способах оплаты и активных сессиях."
        noindex
      />
      <ClientProfile />
    </>
  );
};

export default Profile;
