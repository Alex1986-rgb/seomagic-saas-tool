
import React from 'react';
import AdminAudits from '@/components/admin/AdminAudits';
import PageSeo from '@/components/seo/PageSeo';

const AdminAuditsPage: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Управление аудитами: все проверки сайтов и их статусы"
        description="Администрирование запущенных аудитов: просмотр очереди задач, остановка и перезапуск проверок, разбор ошибок сканирования."
        noindex
      />
      
      <div>
        <h1 className="text-2xl font-bold mb-6">Управление аудитами</h1>
        <AdminAudits />
      </div>
    </>
  );
};

export default AdminAuditsPage;
