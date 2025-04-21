
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/admin/Dashboard';

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      <Dashboard />
    </Layout>
  );
};

export default AdminPanel;
