
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiDocs: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">API Документация</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полная документация по использованию API платформы SeoMarket
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 w-full mb-8">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="authentication">Аутентификация</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Примеры</TabsTrigger>
            </TabsList>
            
            <div className="bg-background/50 backdrop-blur-sm border rounded-lg p-6 shadow-md">
              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2>Обзор API</h2>
                  <p>
                    API платформы SeoMarket предоставляет доступ к функциям сканирования, 
                    аудита и отслеживания позиций сайта через HTTP REST API.
                  </p>
                  <h3>Базовый URL</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>https://api.seomarket.com/v1</code>
                  </pre>
                  <h3>Форматы ответа</h3>
                  <p>
                    Все ответы возвращаются в формате JSON.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="authentication">
                <div className="prose max-w-none">
                  <h2>Аутентификация</h2>
                  <p>
                    Для доступа к API необходимо использовать API-ключ, который можно получить в личном кабинете.
                  </p>
                  <h3>Заголовки авторизации</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="endpoints">
                <div className="prose max-w-none">
                  <h2>Endpoints</h2>
                  <h3>Аудит сайта</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`POST /audit
Content-Type: application/json

{
  "url": "https://example.com",
  "depthLimit": 3,
  "includeImages": true
}`}</code>
                  </pre>
                  
                  <h3>Отслеживание позиций</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`POST /positions/track
Content-Type: application/json

{
  "url": "https://example.com",
  "keywords": ["seo", "optimization", "audit"],
  "searchEngine": "google",
  "country": "ru"
}`}</code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="examples">
                <div className="prose max-w-none">
                  <h2>Примеры использования</h2>
                  <h3>cURL</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`curl -X POST \\
  https://api.seomarket.com/v1/audit \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "url": "https://example.com",
    "depthLimit": 3,
    "includeImages": true
  }'`}</code>
                  </pre>
                  
                  <h3>JavaScript</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`fetch('https://api.seomarket.com/v1/audit', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    depthLimit: 3,
    includeImages: true
  })
})
.then(response => response.json())
.then(data => console.log(data));`}</code>
                  </pre>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ApiDocs;
