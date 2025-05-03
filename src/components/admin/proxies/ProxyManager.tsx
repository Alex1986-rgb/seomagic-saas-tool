import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProxySourcesManager from './ProxySourcesManager';
import { useProxyManager } from '@/hooks/use-proxy-manager';

const ProxyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const { 
    proxies, 
    activeProxies, 
    collectProxies, 
    testProxies, 
    importProxies, 
    isLoading, 
    progress, 
    statusMessage 
  } = useProxyManager({ initialTestUrl: 'https://api.ipify.org/' });

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sources">Источники прокси</TabsTrigger>
          <TabsTrigger value="proxies">Список прокси ({proxies.length})</TabsTrigger>
          <TabsTrigger value="stats">Статистика</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4">
            <ProxySourcesManager />
            
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">
                <p>Текущее количество активных прокси: <strong className="text-green-600">{activeProxies.length}</strong></p>
                <p>Всего прокси в базе: <strong>{proxies.length}</strong></p>
                
                {isLoading && progress > 0 && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                    <p className="text-xs mt-1">{statusMessage}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="proxies">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Управление прокси</h3>
            {/* Proxy management UI would go here */}
            <p className="text-sm text-muted-foreground">Добавляйте и настраивайте прокси в разделе "Источники прокси".</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Статистика прокси</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm border-b pb-2">
                <span>Всего прокси:</span>
                <span className="font-medium">{proxies.length}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2">
                <span>Активных прокси:</span>
                <span className="font-medium text-green-600">{activeProxies.length}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2">
                <span>Неактивных прокси:</span>
                <span className="font-medium text-red-600">{proxies.length - activeProxies.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Процент активности:</span>
                <span className="font-medium">
                  {proxies.length > 0 ? Math.round((activeProxies.length / proxies.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProxyManager;
