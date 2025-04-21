
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

const AdminLayout: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      <Outlet />
    </Layout>
  );
};

export default AdminLayout;
