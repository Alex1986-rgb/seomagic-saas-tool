
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Server } from "lucide-react";

interface ServerInfoItem {
  label: string;
  value: string;
}
interface Props {
  info: ServerInfoItem[];
}
const ServerInfo: React.FC<Props> = ({ info }) => (
  <Card className="mb-8 shadow border-0 bg-gradient-to-br from-[#191b2a]/75 via-[#23263B]/80 to-[#5B47BA]/40 glass-morphism">
    <CardHeader className="pb-2 flex flex-row items-center gap-3">
      <Server className="text-[#8B5CF6] bg-primary/10 rounded-lg p-2 h-9 w-9 mr-1" />
      <div>
        <CardTitle className="text-lg font-medium font-playfair">Информация о сервере</CardTitle>
        <CardDescription>Технические характеристики и версии</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {info.map((item, i) => (
          <div key={i} className="border border-primary/20 rounded-xl p-3 bg-background/20 glass-panel transition-all">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="font-medium font-playfair">{item.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
export default ServerInfo;
