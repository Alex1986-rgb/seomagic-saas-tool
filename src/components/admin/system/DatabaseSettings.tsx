
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Save, RefreshCw } from 'lucide-react';

const DatabaseSettings: React.FC = () => {
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('5432');
  const [dbName, setDbName] = useState('seomarket_db');
  const [dbUser, setDbUser] = useState('postgres');
  const [isConnectionPooling, setIsConnectionPooling] = useState(true);
  const [isQueryCaching, setIsQueryCaching] = useState(true);
  
  const handleSaveSettings = () => {
    console.log('Saving database settings:', {
      dbHost, dbPort, dbName, dbUser,
      isConnectionPooling, isQueryCaching
    });
    // Here would be an API call to save settings
  };
  
  const handleTestConnection = () => {
    console.log('Testing connection...');
    // Here would be an API call to test database connection
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Настройки базы данных</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Хост базы данных</Label>
              <Input 
                id="db-host" 
                value={dbHost} 
                onChange={(e) => setDbHost(e.target.value)} 
                placeholder="Хост"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="db-port">Порт</Label>
              <Input 
                id="db-port" 
                value={dbPort} 
                onChange={(e) => setDbPort(e.target.value)} 
                placeholder="Порт"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="db-name">Имя базы данных</Label>
              <Input 
                id="db-name" 
                value={dbName} 
                onChange={(e) => setDbName(e.target.value)} 
                placeholder="Имя БД"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="db-user">Пользователь</Label>
              <Input 
                id="db-user" 
                value={dbUser} 
                onChange={(e) => setDbUser(e.target.value)} 
                placeholder="Пользователь"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="db-password">Пароль</Label>
              <Input 
                id="db-password" 
                type="password" 
                placeholder="********"
              />
            </div>
            
            <div className="pt-4 space-y-4">
              <h4 className="text-md font-medium">Оптимизация</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="connection-pooling">Пул подключений</Label>
                  <p className="text-sm text-muted-foreground">Оптимизация использования соединений с БД</p>
                </div>
                <Switch 
                  id="connection-pooling" 
                  checked={isConnectionPooling}
                  onCheckedChange={setIsConnectionPooling}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="query-caching">Кеширование запросов</Label>
                  <p className="text-sm text-muted-foreground">Кеширование часто используемых запросов</p>
                </div>
                <Switch 
                  id="query-caching" 
                  checked={isQueryCaching}
                  onCheckedChange={setIsQueryCaching}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить настройки
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Проверить соединение
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSettings;
