
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProxyStatusAlertProps {
  hasActiveProxies: boolean;
}

export const ProxyStatusAlert: React.FC<ProxyStatusAlertProps> = ({
  hasActiveProxies
}) => {
  if (hasActiveProxies) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Активные прокси доступны для проверки.
          Это повысит точность результатов и поможет избежать блокировок.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        Нет доступных прокси. Проверка будет выполнена напрямую,
        что может повлиять на точность результатов.
      </AlertDescription>
    </Alert>
  );
};
