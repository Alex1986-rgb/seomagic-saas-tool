# SEO Audit Analyzers

Реальные анализаторы для комплексного SEO-аудита сайта.

## Архитектура

### 1. SEO Analyzer (`seoAnalyzer.ts`)

Анализирует SEO-факторы страниц:

- **Meta Tags:**
  - Title (наличие, длина 30-60 символов, уникальность)
  - Description (наличие, длина 120-160 символов)
  
- **Заголовки:**
  - H1 (наличие, количество, уникальность)
  - Иерархия H1-H6
  
- **URL Structure:**
  - Длина URL
  - Использование параметров
  - ЧПУ (человекопонятные URL)
  
- **Ссылки:**
  - Внутренняя перелинковка
  - Внешние ссылки
  - Анкоры ссылок

### 2. Technical Analyzer (`technicalAnalyzer.ts`)

Анализирует технические аспекты:

- **Безопасность:**
  - HTTPS/SSL сертификат
  
- **HTTP Статус-коды:**
  - 2xx (успешные)
  - 3xx (редиректы)
  - 4xx (ошибки клиента)
  - 5xx (ошибки сервера)
  
- **Редиректы:**
  - Наличие редиректов
  - Цепочки редиректов
  
- **Производительность:**
  - Время загрузки страниц
  - Размер контента
  
- **Индексация:**
  - Robots meta tags
  - Доступность для индексации

### 3. Audit Service (`AuditService.ts`)

Координирует работу анализаторов и агрегирует результаты:

```typescript
const auditData = await AuditService.processAuditData(url, pages);
```

## Процесс аудита

### Edge Function Flow:

```
1. audit-start (запуск)
   ↓
2. audit-processor (обработка)
   ├── Crawling (сбор страниц)
   ├── SEO Analysis
   ├── Technical Analysis
   └── Content Analysis (TODO)
   ↓
3. audit-status (проверка статуса)
   ↓
4. Результаты сохраняются в БД
```

### Детальный процесс:

1. **Инициализация** (`audit-start`)
   - Создание задачи в `audit_tasks`
   - Статус: `queued`

2. **Обработка** (`audit-processor`)
   - Crawling страниц с помощью Cheerio
   - Извлечение HTML, meta-тегов, заголовков, ссылок
   - Анализ через SEOAnalyzer и TechnicalAnalyzer
   - Расчет общего score

3. **Сохранение результатов**
   - Данные в `audit_results`
   - Детальная информация в JSONB полях

## Scoring System

### Веса категорий:
- SEO: 25%
- Performance: 20%
- Content: 20%
- Technical: 20%
- Mobile: 10%
- Usability: 5%

### Оценки:
- 90-100: Отлично ✅
- 70-89: Хорошо ⚠️
- 50-69: Нуждается в улучшении ⚠️
- 0-49: Критично ❌

## Использование

### Frontend:

```typescript
import { AuditService } from '@/services/audit/AuditService';

// После получения данных crawling
const auditData = await AuditService.processAuditData(url, pages);

// Получить insights
const insights = AuditService.getAnalysisInsights(
  seoResults, 
  technicalResults
);
```

### Edge Function:

```typescript
import { SEOAnalyzer, TechnicalAnalyzer } from './analyzers/index.ts';

const seoAnalyzer = new SEOAnalyzer();
pages.forEach(page => seoAnalyzer.addPage(page));
const seoResults = seoAnalyzer.analyze();
```

## Дальнейшее развитие

### Этап 2: Performance Analyzer
- Core Web Vitals (LCP, FID, CLS)
- Page Speed analysis
- Resource optimization

### Этап 3: Content Analyzer (с AI)
- Качество контента (Lovable AI)
- Keyword density
- Duplicate content detection
- Readability scores

### Этап 4: Mobile & Usability
- Mobile-friendly тест
- Touch element sizing
- Accessibility (ARIA, semantic HTML)
- Navigation analysis

## База данных

### Таблица `audit_tasks`:
```sql
- id
- user_id
- url
- status (queued, processing, completed, failed)
- task_type (quick, deep)
- stage (crawling, analyzing, completed)
- pages_scanned
- progress
- current_url
```

### Таблица `audit_results`:
```sql
- id
- task_id
- url
- score
- pages_analyzed
- seo_score
- technical_score
- seo_data (JSONB)
- technical_data (JSONB)
- pages_data (JSONB)
```

## Примеры результатов

### SEO Analysis Result:
```json
{
  "score": 75,
  "items": [
    {
      "id": "missing-title",
      "title": "Отсутствуют meta title",
      "status": "error",
      "impact": "high",
      "affectedUrls": [...]
    }
  ],
  "details": {
    "metaTitles": {
      "present": 8,
      "optimal": 5,
      "missing": 2
    }
  }
}
```

### Technical Analysis Result:
```json
{
  "score": 85,
  "items": [
    {
      "id": "https-enabled",
      "title": "HTTPS включен",
      "status": "good",
      "impact": "high"
    }
  ],
  "details": {
    "https": {
      "secure": 10,
      "insecure": 0
    }
  }
}
```
