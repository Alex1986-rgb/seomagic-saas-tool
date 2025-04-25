
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send } from 'lucide-react';

const PingServiceHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Send className="h-5 w-5" />
        Сервис пинга через XML-RPC
      </CardTitle>
      <CardDescription>
        Уведомление поисковых систем и агрегаторов об обновлении контента
      </CardDescription>
    </CardHeader>
  );
};

export default PingServiceHeader;
