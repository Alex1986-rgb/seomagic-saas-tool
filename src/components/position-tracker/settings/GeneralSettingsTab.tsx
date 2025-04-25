
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsTabProps {
  checkInterval: number;
  setCheckInterval: (value: number) => void;
  useProxy: boolean;
  setUseProxy: (value: boolean) => void;
}

export function GeneralSettingsTab({
  checkInterval,
  setCheckInterval,
  useProxy,
  setUseProxy
}: GeneralSettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Интервал проверки позиций (минуты)</Label>
        <Input 
          type="number"
          value={checkInterval}
          onChange={(e) => setCheckInterval(Number(e.target.value))}
          min={5}
          max={1440}
        />
        <p className="text-xs text-muted-foreground">
          Минимальный интервал между автоматическими проверками позиций
        </p>
      </div>

      <div className="flex flex-col space-y-1.5 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="use-proxy">Использовать прокси</Label>
          <Switch 
            id="use-proxy" 
            checked={useProxy}
            onCheckedChange={setUseProxy}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Использование прокси помогает избежать блокировок и получать более точные результаты
        </p>
      </div>
    </div>
  );
}
