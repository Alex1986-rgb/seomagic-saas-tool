
import React from "react";
import DatabaseSettings from "@/components/admin/system/DatabaseSettings";
import { Card, CardContent } from "@/components/ui/card";

const DatabaseSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Настройки базы данных</h2>
    <Card>
      <CardContent className="p-0">
        <DatabaseSettings />
      </CardContent>
    </Card>
  </div>
);

export default DatabaseSettingsPage;
