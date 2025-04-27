
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Shield, TrashIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProxySettingsTabProps {
  activeProxies: number;
  isLoading: boolean;
  progress?: number;
  statusMessage?: string;
  clearBeforeCollect: boolean;
  setClearBeforeCollect: (value: boolean) => void;
  testUrl: string;
  setTestUrl: (value: string) => void;
  onCollectProxies: () => void;
  onTestProxies: () => void;
  onClearProxies: () => void;
}

export function ProxySettingsTab({
  activeProxies,
  isLoading,
  progress = 0,
  statusMessage = '',
  clearBeforeCollect,
  setClearBeforeCollect,
  testUrl,
  setTestUrl,
  onCollectProxies,
  onTestProxies,
  onClearProxies
}: ProxySettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Активные прокси</Label>
          <Badge variant="outline" className={
            activeProxies > 0 
              ? "bg-green-50 text-green-700" 
              : "bg-yellow-50 text-yellow-700"
          }>
            {activeProxies}
          </Badge>
        </div>
        
        <div className="flex flex-col space-y-1.5 pt-2 mb-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="clear-before-collect">Очищать список перед сбором</Label>
            <Switch 
              id="clear-before-collect" 
              checked={clearBeforeCollect}
              onCheckedChange={setClearBeforeCollect}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Если включено, старые прокси будут удалены перед сбором новых
          </p>
        </div>
        
        {isLoading && progress > 0 && (
          <div className="space-y-2 my-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-center">{statusMessage}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onCollectProxies}
            disabled={isLoading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Собрать прокси
          </Button>
          <Button
            variant="outline"
            onClick={onTestProxies}
            disabled={isLoading}
            className="flex-1"
          >
            <Shield className="h-4 w-4 mr-2" />
            Проверить прокси
          </Button>
          <Button
            variant="outline"
            onClick={onClearProxies}
            disabled={isLoading}
            className="w-full mt-2"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Очистить все прокси
          </Button>
        </div>
        
        <div>
          <Label>URL для тестирования прокси</Label>
          <Input 
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="https://api.ipify.org/"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL для проверки работоспособности прокси
          </p>
        </div>
        
        {activeProxies === 0 && !isLoading && (
          <Alert variant="warning" className="mt-2">
            <AlertDescription>
              Нет активных прокси. Рекомендуется собрать и проверить прокси для корректной работы сервиса.
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-xs text-muted-foreground">
          {isLoading 
            ? "Выполняется операция с прокси..." 
            : activeProxies > 0 
              ? `Доступно ${activeProxies} прокси для использования`
              : "Нет активных прокси. Нажмите 'Собрать прокси' для автоматического сбора"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Для более детальной настройки прокси перейдите в <a href="/admin/proxies" className="text-primary hover:underline">раздел управления прокси</a>
        </p>
      </div>
    </div>
  );
}
