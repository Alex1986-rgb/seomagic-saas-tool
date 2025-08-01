import React from 'react';
import Layout from '../components/Layout';

const Channel: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Канал</h1>
        <p className="text-lg text-muted-foreground">
          Информация о канале и обновлениях
        </p>
      </div>
    </Layout>
  );
};

export default Channel;