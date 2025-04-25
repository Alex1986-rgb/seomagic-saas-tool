
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiSettingsSectionProps {
  captchaApiKey: string;
  setCaptchaKey: (value: string) => void;
  botableApiKey: string;
  setBotableKey: (value: string) => void;
}

export function ApiSettingsSection({
  captchaApiKey,
  setCaptchaKey,
  botableApiKey,
  setBotableKey
}: ApiSettingsSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t">
      <div className="space-y-2">
        <Label>IP Captcha Guru API ключ</Label>
        <Input
          type="password"
          value={captchaApiKey}
          onChange={(e) => setCaptchaKey(e.target.value)}
          placeholder="Введите API ключ для IPCaptchaGuru"
        />
        <p className="text-xs text-muted-foreground">
          Используется для обхода капчи при проверке позиций
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Botable API ключ</Label>
        <Input
          type="password"
          value={botableApiKey}
          onChange={(e) => setBotableKey(e.target.value)}
          placeholder="Введите API ключ для Botable"
        />
        <p className="text-xs text-muted-foreground">
          Используется для обхода защиты от ботов
        </p>
      </div>
    </div>
  );
}
