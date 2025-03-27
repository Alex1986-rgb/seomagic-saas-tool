
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClientNotifications from '@/components/client/ClientNotifications';

interface NotificationsTabProps {
  onOpenSettings: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ onOpenSettings }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Уведомления</h2>
        <Button className="gap-2" onClick={onOpenSettings}>
          <Settings size={16} className="mr-2" />
          Настройки уведомлений
        </Button>
      </div>
      <ClientNotifications />
    </div>
  );
};
