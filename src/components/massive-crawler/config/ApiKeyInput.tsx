
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="api-key">API Ключ для сервиса сканирования</Label>
      <Input
        id="api-key"
        type="password"
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Введите ваш API ключ"
      />
      <p className="text-sm text-muted-foreground">
        Вам необходим действующий API ключ для масштабного сканирования
      </p>
    </div>
  );
};
