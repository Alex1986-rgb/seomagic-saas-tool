
import React from "react";
import UsersManagement from "@/components/admin/system/UsersManagement";
import { Card, CardContent } from "@/components/ui/card";

const UsersManagementPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Пользователи системы</h2>
    <Card>
      <CardContent className="p-0">
        <UsersManagement />
      </CardContent>
    </Card>
  </div>
);

export default UsersManagementPage;
