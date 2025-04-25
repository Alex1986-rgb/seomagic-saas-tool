
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, CheckCircle2 } from "lucide-react";
import { openaiService } from "@/services/api/openaiService";

interface ApiKeyInputProps {
  openaiKey: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ openaiKey, onChange }) => {
  const hasSystemKey = openaiService.getApiKey();

  if (hasSystemKey) {
    return (
      <Alert className="bg-green-500/10 border border-green-500/20">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-600">
          API ключ OpenAI настроен в системе
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey" className="flex items-center">
        <Key className="mr-2 h-4 w-4" />
        API ключ OpenAI
      </Label>
      <Input 
        id="apiKey" 
        type="password" 
        placeholder="sk-..." 
        value={openaiKey} 
        onChange={onChange}
      />
      {openaiKey && !openaiKey.startsWith("sk-") && (
        <p className="text-sm text-destructive">API ключ должен начинаться с "sk-"</p>
      )}
      <p className="text-sm text-muted-foreground">
        Вы также можете установить API ключ глобально в настройках системы для всех функций ИИ.
      </p>
    </div>
  );
};

export default ApiKeyInput;
