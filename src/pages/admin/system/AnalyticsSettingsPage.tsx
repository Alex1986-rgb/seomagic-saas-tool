
import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <Card>
      <CardContent className="p-0">
        <AnalyticsSettings />
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsSettingsPage;
