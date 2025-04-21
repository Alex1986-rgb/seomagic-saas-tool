
import React from 'react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Аналитика</h2>
      <AdminAnalytics />
    </div>
  );
};

export default AdminAnalyticsPage;
