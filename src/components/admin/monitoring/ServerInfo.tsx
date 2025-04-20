
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ServerInfoItem {
  label: string;
  value: string;
}
interface Props {
  info: ServerInfoItem[];
}
const ServerInfo: React.FC<Props> = ({ info }) => (
  <Card className="mb-8 shadow">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Информация о сервере</CardTitle>
      <CardDescription>Технические характеристики и версии</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {info.map((item, i) => (
          <div key={i} className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
export default ServerInfo;
