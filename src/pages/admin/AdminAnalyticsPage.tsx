
import React from 'react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Gauge, BarChart2, Monitor, Users } from "lucide-react";

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white/60 to-purple-50 flex items-center gap-6 border border-primary/15 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <BarChart2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Аналитика</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Monitor className="h-5 w-5" /> Графики и метрики &nbsp;
            <Gauge className="h-5 w-5" /> Производительность
            <Users className="h-5 w-5" /> Пользователи
          </div>
        </div>
      </div>
      <AdminAnalytics />
    </div>
  );
};

export default AdminAnalyticsPage;
