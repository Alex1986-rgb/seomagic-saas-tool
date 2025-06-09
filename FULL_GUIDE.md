
# 📚 Полное руководство по SeoMarket

## 🎯 Содержание

1. [Деплой на различных хостингах](#деплой)
2. [Настройка CI/CD](#ci-cd)
3. [Управление контентом через админ-панель](#контент)
4. [SEO настройки](#seo)
5. [Подключение домена и SSL](#домен)
6. [Чеклист публикации](#чеклист)
7. [Мониторинг и поддержка](#мониторинг)

---

## 🚀 Деплой на различных хостингах {#деплой}

### Lovable (Рекомендуется для начинающих)

**Преимущества**: Автоматическая настройка, интеграция с Supabase, SSL из коробки

```bash
# В интерфейсе Lovable:
1. Нажмите "Publish" в правом верхнем углу
2. Выберите домен (поддомен .lovable.app или свой)
3. Подтвердите публикацию
4. Сайт будет доступен через несколько минут
```

**Настройка пользовательского домена в Lovable**:
1. Project > Settings > Domains
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям
4. Дождитесь проверки SSL (до 24 часов)

---

### Vercel (Рекомендуется для продакшена)

**Преимущества**: Отличная производительность, автоматический CI/CD, Edge Network

#### Шаг 1: Подготовка проекта
```bash
# Установите Vercel CLI
npm install -g vercel

# В корне проекта создайте vercel.json
```

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/**/*.[jt]s": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

#### Шаг 2: Деплой
```bash
# Первоначальный деплой
vercel

# Деплой в продакшен
vercel --prod

# Настройка переменных окружения
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Шаг 3: Настройка домена
```bash
# Добавление пользовательского домена
vercel domains add yourdomain.com
vercel domains add www.yourdomain.com
```

---

### Netlify

**Преимущества**: Простота использования, отличная документация, бесплатный план

#### Шаг 1: Подготовка
```bash
# Создайте _redirects в public/
echo "/*    /index.html   200" > public/_redirects

# Создайте netlify.toml
```

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Шаг 2: Деплой
```bash
# Через Netlify CLI
npm install -g netlify-cli
netlify deploy --build --prod

# Или через Git интеграцию:
# 1. Подключите GitHub репозиторий в Netlify
# 2. Настройте build команды
# 3. Добавьте переменные окружения
```

---

### Firebase Hosting

#### Шаг 1: Настройка
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

#### Шаг 2: Конфигурация firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

#### Шаг 3: Деплой
```bash
npm run build
firebase deploy --only hosting
```

---

### VPS/Dedicated Server (nginx)

#### Шаг 1: Подготовка сервера
```bash
# Обновление системы (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка nginx
sudo apt install nginx -y

# Установка certbot для SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### Шаг 2: Сборка проекта
```bash
# Клонирование и сборка
git clone https://github.com/yourusername/seomarket.git
cd seomarket
npm install
npm run build

# Копирование файлов
sudo cp -r dist/* /var/www/seomarket/
sudo chown -R www-data:www-data /var/www/seomarket/
```

#### Шаг 3: Настройка nginx
```nginx
# /etc/nginx/sites-available/seomarket
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/seomarket;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Static files caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker
    location /service-worker.js {
        expires off;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (если нужно)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Шаг 4: Активация и SSL
```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/seomarket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Получение SSL сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ⚙️ Настройка CI/CD {#ci-cd}

### GitHub Actions (Рекомендуется)

#### Базовый workflow для Vercel
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

#### Workflow для VPS
```yaml
# .github/workflows/deploy-vps.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.8
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/seomarket
            git pull origin main
            npm ci
            npm run build
            sudo cp -r dist/* /var/www/seomarket/
            sudo systemctl reload nginx
```

### Настройка секретов GitHub

В настройках репозитория (Settings > Secrets and variables > Actions) добавьте:

```
# Для Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id

# Для VPS
SERVER_HOST=your_server_ip
SERVER_USER=ubuntu
SERVER_SSH_KEY=your_private_key

# Переменные окружения
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🎛 Управление контентом через админ-панель {#контент}

### Доступ к админ-панели

1. Перейдите на `/admin` вашего сайта
2. Войдите с правами администратора
3. Используйте боковое меню для навигации

### Структура админ-панели

#### 📊 Аналитика и мониторинг
- **Dashboard** — Общая статистика платформы
- **Users** — Управление пользователями  
- **Analytics** — Детальная аналитика
- **Monitoring** — Мониторинг системы

#### ⚙️ Настройки контента
- **Content Management** — Редактирование текстов страниц
- **Site Settings** — Общие настройки сайта
- **Theme Settings** — Настройка тем и стилей
- **Navigation** — Управление меню и навигацией

#### 💰 Коммерческие настройки
- **Payments** — Управление платежами
- **Pricing** — Настройка тарифных планов
- **Subscriptions** — Управление подписками

#### 🛠 Системные настройки
- **System Settings** — Конфигурация системы
- **Website Analyzer** — Инструменты анализа
- **Proxy Management** — Управление прокси
- **Security** — Настройки безопасности

### Редактирование контента

#### Главная страница
```typescript
// Пример изменения контента главной страницы
const updateHeroSection = {
  title: "Ваш новый заголовок",
  subtitle: "Описание сервиса", 
  ctaText: "Начать анализ",
  features: [
    "Бесплатный SEO-аудит",
    "AI-рекомендации",
    "Отслеживание позиций"
  ]
}
```

#### Страница аудита
- Настройка текстов форм
- Изменение советов и подсказок
- Конфигурация результатов

#### Страница о компании
- Редактирование информации о команде
- Изменение миссии и ценностей
- Управление отзывами

### Управление пользователями

#### Создание администратора
```sql
-- В Supabase SQL Editor
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb 
WHERE email = 'admin@yourdomain.com';
```

#### Назначение ролей
- **admin** — Полный доступ
- **moderator** — Управление контентом
- **user** — Обычный пользователь

---

## 🔍 SEO настройки {#seo}

### Базовые мета-теги

Убедитесь, что каждая страница имеет уникальные:

```html
<title>Уникальный заголовок страницы | SeoMarket</title>
<meta name="description" content="Описание страницы до 160 символов">
<meta name="keywords" content="ключевые, слова, через, запятую">
```

### Open Graph и Twitter Cards

```html
<!-- Open Graph -->
<meta property="og:title" content="Заголовок для соцсетей">
<meta property="og:description" content="Описание для соцсетей">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com/current-page">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Заголовок для Twitter">
<meta name="twitter:description" content="Описание для Twitter">
<meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg">
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SeoMarket",
  "description": "Платформа для SEO-анализа и оптимизации",
  "url": "https://seomarket.ru",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "RUB"
  }
}
```

### Sitemap.xml

Создайте автоматический sitemap:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/audit</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt

```
User-agent: *
Allow: /

# Запретить сканирование админки
Disallow: /admin/
Disallow: /api/

# Указать sitemap
Sitemap: https://yourdomain.com/sitemap.xml
```

### Оптимизация производительности

#### Lazy Loading
```tsx
// Пример lazy loading компонента
const AuditResults = lazy(() => import('./components/AuditResults'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuditResults />
    </Suspense>
  );
}
```

#### Оптимизация изображений
```tsx
// Компонент для оптимизированных изображений
const OptimizedImage = ({ src, alt, ...props }) => (
  <img 
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
  />
);
```

#### Code Splitting
```tsx
// Разделение кода по роутам
const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Home"))
  },
  {
    path: "/audit", 
    component: lazy(() => import("./pages/Audit"))
  }
];
```

---

## 🌐 Подключение домена и SSL {#домен}

### Шаг 1: Покупка домена

Рекомендуемые регистраторы:
- **REG.RU** — для .ru/.рф доменов
- **Namecheap** — международные домены
- **Cloudflare** — домены + CDN

### Шаг 2: Настройка DNS

#### Для хостинга на Vercel/Netlify
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

#### Для VPS хостинга
```
Type: A
Name: @
Value: 123.456.789.10 (IP вашего сервера)

Type: A
Name: www  
Value: 123.456.789.10

Type: MX (для почты)
Name: @
Value: 10 mail.yourdomain.com
```

#### Дополнительные записи
```
# Подтверждение домена
Type: TXT
Name: @
Value: "google-site-verification=abc123..."

# SPF для почты
Type: TXT  
Name: @
Value: "v=spf1 include:_spf.google.com ~all"

# DMARC
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Шаг 3: Проверка настроек

```bash
# Проверка DNS записей
nslookup yourdomain.com
dig yourdomain.com

# Проверка SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Онлайн инструменты
# - whatsmydns.net - проверка DNS
# - ssllabs.com - тест SSL
# - gtmetrix.com - скорость сайта
```

### Шаг 4: Настройка SSL

#### Для Lovable/Vercel/Netlify
SSL настраивается автоматически при подключении домена.

#### Для VPS (Let's Encrypt)
```bash
# Установка certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Для Cloudflare
1. Добавьте сайт в Cloudflare
2. Измените nameservers у регистратора
3. Включите "Full (strict)" SSL режим
4. Настройте Page Rules для оптимизации

---

## ✅ Чеклист публикации {#чеклист}

### Перед деплоем

#### 🔧 Техническая подготовка
- [ ] Все тесты проходят (`npm test`)
- [ ] Нет ошибок линтинга (`npm run lint`)
- [ ] TypeScript проверки проходят (`npm run type-check`)
- [ ] Проект собирается без ошибок (`npm run build`)
- [ ] Проверена работа в разных браузерах
- [ ] Протестирована мобильная версия
- [ ] Оптимизированы изображения (WebP, сжатие)
- [ ] Настроены мета-теги для всех страниц

#### 🗄 База данных и бэкенд
- [ ] Supabase проект настроен
- [ ] RLS политики активированы
- [ ] Миграции применены
- [ ] Seed данные загружены (если нужно)
- [ ] Edge функции развернуты
- [ ] API ключи добавлены в секреты

#### 🔐 Безопасность
- [ ] HTTPS включен
- [ ] Security headers настроены
- [ ] CORS правильно сконфигурирован
- [ ] API ключи не хранятся в коде
- [ ] Админ-панель защищена
- [ ] Валидация на фронтенде и бэкенде

### Деплой

#### 🚀 Процесс развертывания
- [ ] Переменные окружения настроены
- [ ] Домен подключен
- [ ] DNS записи настроены
- [ ] SSL сертификат активен
- [ ] CDN настроен (если используется)
- [ ] Redirect с www на без www (или наоборот)

#### 📊 Аналитика и мониторинг
- [ ] Google Analytics подключен
- [ ] Yandex.Metrica настроена
- [ ] Google Search Console добавлен
- [ ] Yandex.Webmaster подключен
- [ ] Uptime мониторинг настроен
- [ ] Error tracking включен (Sentry)

### После деплоя

#### 🧪 Тестирование в продакшене
- [ ] Главная страница загружается
- [ ] Все основные функции работают
- [ ] Форма аудита функционирует
- [ ] Регистрация/авторизация работает
- [ ] Админ-панель доступна
- [ ] Мобильная версия корректна
- [ ] Скорость загрузки приемлемая

#### 🔍 SEO проверка
- [ ] Robots.txt доступен
- [ ] Sitemap.xml создан и отправлен
- [ ] Мета-теги уникальные для каждой страницы  
- [ ] Open Graph теги настроены
- [ ] Schema.org разметка добавлена
- [ ] Сайт проиндексирован поисковиками

#### 📈 Запуск
- [ ] Backup настроен
- [ ] Команда обучена работе с админкой
- [ ] Документация обновлена
- [ ] Пользователи уведомлены о запуске
- [ ] Support каналы настроены
- [ ] Мониторинг ошибок активен

---

## 📊 Мониторинг и поддержка {#мониторинг}

### Системный мониторинг

#### Uptime мониторинг
```bash
# Простой скрипт проверки доступности
#!/bin/bash
URL="https://yourdomain.com"
if curl -f -s $URL > /dev/null; then
    echo "Site is up"
else
    echo "Site is down" | mail -s "Site Down Alert" admin@yourdomain.com
fi
```

#### Логирование ошибок
```typescript
// Интеграция с Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});

// Обработка ошибок
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});
```

### Аналитика производительности

#### Web Vitals мониторинг
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Отправка метрик в Google Analytics
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Backup стратегия

#### База данных (Supabase)
- Автоматические backup включены по умолчанию
- Point-in-time recovery до 7 дней (Free) / 30 дней (Pro)
- Экспорт данных: Dashboard > Settings > General > Export data

#### Код (GitHub)
```bash
# Настройка автоматического backup
git remote add backup https://github.com/yourcompany/seomarket-backup.git
git push backup main

# Еженедельный backup скрипт
#!/bin/bash
cd /path/to/seomarket
git bundle create backup-$(date +%Y%m%d).bundle --all
```

### Планы реагирования на инциденты

#### Уровни критичности
1. **Critical** — Сайт недоступен (решение: немедленно)
2. **High** — Основные функции не работают (решение: 2 часа)
3. **Medium** — Частичные проблемы (решение: 24 часа)
4. **Low** — Косметические проблемы (решение: 1 неделя)

#### Контакты поддержки
```yaml
# Команда поддержки
Primary: admin@yourdomain.com
Secondary: support@yourdomain.com
Emergency: +7-xxx-xxx-xxxx

# Поставщики услуг
Hosting: support@vercel.com
Database: support@supabase.com
Domain: support@reg.ru
```

### Обновления и поддержка

#### Регулярное обслуживание
- **Еженедельно**: Проверка безопасности, обновление зависимостей
- **Ежемесячно**: Анализ производительности, очистка логов
- **Ежеквартально**: Backup тестирование, security аудит

#### План обновлений
```bash
# Скрипт обновления зависимостей
#!/bin/bash
npm audit
npm update
npm run test
npm run build

# Проверка устаревших пакетов
npx npm-check-updates
```

---

## 🔧 Частые проблемы и решения

### Проблемы производительности
- **Медленная загрузка**: Включите lazy loading, оптимизируйте изображения
- **Высокий bundle size**: Используйте code splitting
- **Медленный API**: Добавьте кэширование, используйте CDN

### Проблемы SEO
- **Плохая индексация**: Проверьте robots.txt и sitemap.xml
- **Дублированный контент**: Настройте canonical URLs
- **Низкие Core Web Vitals**: Оптимизируйте производительность

### Проблемы безопасности  
- **XSS атаки**: Валидируйте пользовательский ввод
- **CSRF**: Используйте CSRF токены
- **SQL инъекции**: Применяйте параметризованные запросы

---

*Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}*

## 📞 Получение помощи

Если у вас возникли вопросы по этому руководству:

1. 📧 **Email**: [dev@seomarket.ru](mailto:dev@seomarket.ru)
2. 💬 **GitHub Issues**: [Создать issue](https://github.com/KyrlanAlanAlexandre/seomarket/issues)
3. 📚 **Документация**: [seomarket.ru/documentation](https://seomarket.ru/documentation)
4. 🎯 **Техподдержка**: [support@seomarket.ru](mailto:support@seomarket.ru)
