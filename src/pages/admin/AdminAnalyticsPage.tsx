
import React from 'react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Аналитика</h1>
      <AdminAnalytics />
    </div>
  );
};

export default AdminAnalyticsPage;
