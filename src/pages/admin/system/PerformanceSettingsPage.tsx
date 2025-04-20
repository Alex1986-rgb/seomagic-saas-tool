
import React from "react";
import PerformanceSettings from "@/components/admin/system/PerformanceSettings";
import { Card, CardContent } from "@/components/ui/card";

const PerformanceSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Производительность</h2>
    <Card>
      <CardContent className="p-0">
        <PerformanceSettings />
      </CardContent>
    </Card>
  </div>
);

export default PerformanceSettingsPage;
