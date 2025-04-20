
import React from "react";
import SecuritySettings from "@/components/admin/system/SecuritySettings";
import { Card, CardContent } from "@/components/ui/card";

const SecuritySettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Настройки безопасности</h2>
    <Card>
      <CardContent className="p-0">
        <SecuritySettings />
      </CardContent>
    </Card>
  </div>
);

export default SecuritySettingsPage;
