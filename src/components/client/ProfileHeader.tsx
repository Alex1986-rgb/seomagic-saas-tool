
import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="mb-6 md:mb-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Личный кабинет</h1>
      <p className="text-sm md:text-lg text-muted-foreground">
        Управляйте вашими SEO-аудитами, подпиской и настройками
      </p>
    </div>
  );
};

export default ProfileHeader;
