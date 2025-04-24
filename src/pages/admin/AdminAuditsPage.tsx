
import React from 'react';
import AdminAudits from '@/components/admin/AdminAudits';
import { FileText, BarChart2, Search } from "lucide-react";

const AdminAuditsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-green-600/20 via-teal-500/20 to-emerald-600/20 flex items-center gap-6 border border-primary/20 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <FileText className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Аудиты</h1>
          <div className="flex gap-4 text-muted-foreground">
            <BarChart2 className="h-5 w-5" /> Статистика проверок
            <Search className="h-5 w-5" /> История сканирований
          </div>
        </div>
      </div>
      <AdminAudits />
    </div>
  );
};

export default AdminAuditsPage;
