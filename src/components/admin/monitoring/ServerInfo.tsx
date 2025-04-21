
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
  <Card className="mb-8 shadow border-0 bg-gradient-to-br from-[#1A1F2C]/80 via-[#28213a]/80 to-[#403E43]/80 backdrop-blur-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Информация о сервере</CardTitle>
      <CardDescription>Технические характеристики и версии</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {info.map((item, i) => (
          <div key={i} className="border border-primary/20 rounded-md p-3 bg-background/20">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
export default ServerInfo;
