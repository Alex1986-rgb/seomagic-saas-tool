
import React from 'react';
import AdminPositions from '@/components/admin/AdminPositions';
import PageSeo from '@/components/seo/PageSeo';

const AdminPositionsPage: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Позиции клиентов: съём выдачи и очередь фоновых проверок"
        description="Администрирование мониторинга позиций: запущенные проверки, расход лимитов поставщика выдачи и разбор неудачных запросов."
        noindex
      />
      <AdminPositions />
    </>
  );
};

export default AdminPositionsPage;
