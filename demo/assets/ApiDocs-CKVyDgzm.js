import{S as e}from"./vendor-CNgkuSqq.js";import{L as a}from"./Layout-CH6HUscc.js";import{T as o,a as d,b as s,c as r}from"./tabs-CeMjGZmH.js";import"./export-BAQ8U8ZN.js";import"./dropdown-menu-DC9eB9xl.js";import"./index-BrlfqYvq.js";import"./pdf-BfkiMKKz.js";import"./badge-DTJBYjV7.js";const p=()=>e.jsx(a,{children:e.jsxs("div",{className:"container mx-auto py-32 px-4",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-4xl font-bold mb-4",children:"API Документация"}),e.jsx("p",{className:"text-lg text-muted-foreground max-w-2xl mx-auto",children:"Полная документация по использованию API платформы SeoMarket"})]}),e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsxs(o,{defaultValue:"overview",children:[e.jsxs(d,{className:"grid grid-cols-2 md:grid-cols-4 w-full mb-8",children:[e.jsx(s,{value:"overview",children:"Обзор"}),e.jsx(s,{value:"authentication",children:"Аутентификация"}),e.jsx(s,{value:"endpoints",children:"Endpoints"}),e.jsx(s,{value:"examples",children:"Примеры"})]}),e.jsxs("div",{className:"bg-background/50 backdrop-blur-sm border rounded-lg p-6 shadow-md",children:[e.jsx(r,{value:"overview",children:e.jsxs("div",{className:"prose max-w-none",children:[e.jsx("h2",{children:"Обзор API"}),e.jsx("p",{children:"API платформы SeoMarket предоставляет доступ к функциям сканирования, аудита и отслеживания позиций сайта через HTTP REST API."}),e.jsx("h3",{children:"Базовый URL"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:"https://api.seomarket.com/v1"})}),e.jsx("h3",{children:"Форматы ответа"}),e.jsx("p",{children:"Все ответы возвращаются в формате JSON."})]})}),e.jsx(r,{value:"authentication",children:e.jsxs("div",{className:"prose max-w-none",children:[e.jsx("h2",{children:"Аутентификация"}),e.jsx("p",{children:"Для доступа к API необходимо использовать API-ключ, который можно получить в личном кабинете."}),e.jsx("h3",{children:"Заголовки авторизации"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:"Authorization: Bearer YOUR_API_KEY"})})]})}),e.jsx(r,{value:"endpoints",children:e.jsxs("div",{className:"prose max-w-none",children:[e.jsx("h2",{children:"Endpoints"}),e.jsx("h3",{children:"Аудит сайта"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:`POST /audit
Content-Type: application/json

{
  "url": "https://example.com",
  "depthLimit": 3,
  "includeImages": true
}`})}),e.jsx("h3",{children:"Отслеживание позиций"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:`POST /positions/track
Content-Type: application/json

{
  "url": "https://example.com",
  "keywords": ["seo", "optimization", "audit"],
  "searchEngine": "google",
  "country": "ru"
}`})})]})}),e.jsx(r,{value:"examples",children:e.jsxs("div",{className:"prose max-w-none",children:[e.jsx("h2",{children:"Примеры использования"}),e.jsx("h3",{children:"cURL"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:`curl -X POST \\
  https://api.seomarket.com/v1/audit \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "url": "https://example.com",
    "depthLimit": 3,
    "includeImages": true
  }'`})}),e.jsx("h3",{children:"JavaScript"}),e.jsx("pre",{className:"bg-muted p-4 rounded-md overflow-x-auto",children:e.jsx("code",{children:`fetch('https://api.seomarket.com/v1/audit', {
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
.then(data => console.log(data));`})})]})})]})]})})]})});export{p as default};
