
import React from "react";
import NotificationsSettings from "@/components/admin/system/NotificationsSettings";
import { Card, CardContent } from "@/components/ui/card";

const NotificationsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Системные уведомления</h2>
    <Card>
      <CardContent className="p-0">
        <NotificationsSettings />
      </CardContent>
    </Card>
  </div>
);

export default NotificationsSettingsPage;
