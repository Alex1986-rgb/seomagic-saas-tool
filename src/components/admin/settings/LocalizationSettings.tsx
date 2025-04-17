
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Check, Languages, Globe } from 'lucide-react';

const LocalizationSettings: React.FC = () => {
  const [defaultLanguage, setDefaultLanguage] = useState("ru");
  const [enableMultiLanguage, setEnableMultiLanguage] = useState(false);
  const [languages, setLanguages] = useState([
    { code: "ru", name: "Русский", enabled: true },
    { code: "en", name: "English", enabled: true },
    { code: "es", name: "Español", enabled: false }
  ]);
  
  const handleToggleLanguage = (code: string) => {
    setLanguages(languages.map(lang => 
      lang.code === code ? { ...lang, enabled: !lang.enabled } : lang
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки локализации</CardTitle>
          <CardDescription>Управление языками и переводами на вашем сайте</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="multi-language" 
              checked={enableMultiLanguage}
              onCheckedChange={setEnableMultiLanguage}
            />
            <Label htmlFor="multi-language">Включить мультиязычность</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-language">Язык по умолчанию</Label>
            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <SelectTrigger id="default-language">
                <SelectValue placeholder="Выберите язык по умолчанию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Доступные языки</Label>
            <div className="space-y-3">
              {languages.map((language) => (
                <div key={language.code} className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">{language.name}</span>
                    <span className="text-sm text-muted-foreground">({language.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={language.enabled ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleToggleLanguage(language.code)}
                    >
                      {language.enabled ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Включен
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Отключен
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Добавить язык
            </Button>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Инструменты перевода</Label>
            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="font-medium">Автоматический перевод</span>
                </div>
                <Switch id="auto-translate" />
              </div>
              <p className="text-sm text-muted-foreground">
                Включите автоматический перевод контента с помощью API для ускорения создания многоязычного сайта.
              </p>
              <div className="pt-4">
                <Label htmlFor="api-key" className="text-sm">API ключ для переводов</Label>
                <Input id="api-key" type="password" className="mt-1" placeholder="Введите ваш API ключ" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalizationSettings;
