# Руководство по интеграции новой модульной архитектуры

## Обзор изменений

В Этапе 3 мы интегрировали новую модульную архитектуру с существующим кодом, сохранив обратную совместимость.

## Архитектура

### Старая структура (src/services/, src/api/)
```
src/
├── services/
│   └── auditService.ts (старый)
├── api/
│   └── seoApiService.ts (старый)
└── contexts/
    └── AuditContext.tsx (объединяет все)
```

### Новая структура (src/modules/)
```
src/
├── modules/
│   ├── audit/
│   │   ├── services/auditService.ts (новый)
│   │   ├── hooks/useAudit.ts
│   │   └── types/index.ts
│   ├── optimization/
│   ├── reports/
│   ├── admin/
│   └── client/
└── contexts/
    ├── AuditModuleContext.tsx (новый)
    └── AuditContext.tsx (обновлен)
```

## Ключевые изменения

### 1. Обновлен useScanAPI.ts

**Старый код:**
```typescript
import { seoApiService } from '@/api/seoApiService';

const response = await seoApiService.startCrawl(url, maxPages);
```

**Новый код:**
```typescript
import { auditService } from '@/modules/audit';

const response = await auditService.startAudit(url, { maxPages, type });
```

**Преимущества:**
- ✅ Использует новые Edge Functions напрямую
- ✅ Типизированные запросы и ответы
- ✅ Лучшая обработка ошибок
- ✅ Работа с новыми таблицами БД (audits, audit_tasks)

### 2. Создан AuditModuleContext

Новый контекст, объединяющий все модули:

```typescript
import { AuditModuleProvider, useAuditModuleContext } from '@/contexts/AuditModuleContext';

function MyComponent() {
  const {
    startAudit,        // Запуск аудита
    auditStatus,       // Статус аудита
    audits,            // Список аудитов
    startOptimization, // Запуск оптимизации
    reports            // Список отчетов
  } = useAuditModuleContext();
}
```

### 3. Обновлен AuditContext

Добавлен доступ к новым модулям через `moduleContext`:

```typescript
const {
  // Старые методы (для обратной совместимости)
  startScan,
  
  // Новые методы через moduleContext
  moduleContext: {
    startAuditNew,      // Использует новую архитектуру
    audits,             // Список из БД
    auditStatus,        // Статус из Edge Function
    startOptimizationNew
  }
} = useAuditContext();
```

## Миграционный путь

### Этап 1: Параллельная работа (текущий)

Старый и новый код работают одновременно:

```typescript
// Старый способ (еще работает)
const { startScan } = useAuditContext();
await startScan(false);

// Новый способ (рекомендуется)
const { moduleContext } = useAuditContext();
await moduleContext.startAuditNew(url, { type: 'quick' });
```

### Этап 2: Постепенная миграция компонентов

Обновляйте компоненты один за другим:

1. **AuditResults** - уже использует новый useScanAPI
2. **ScanContext** - будет обновлен следующим
3. **OptimizationContext** - после ScanContext
4. Остальные компоненты

### Этап 3: Удаление старого кода

После полной миграции удалим:
- `src/api/seoApiService.ts` (старый)
- `src/services/auditService.ts` (старый)
- Старые методы из контекстов

## Как использовать новые модули

### Запуск аудита

```typescript
import { useAudit, useAuditStatus } from '@/modules/audit';

function AuditPage() {
  const { startAudit, taskId } = useAudit();
  const { status, startPolling } = useAuditStatus({
    taskId,
    onComplete: (data) => {
      console.log('Audit completed!', data);
    }
  });

  const handleStart = async () => {
    const newTaskId = await startAudit('https://example.com', {
      type: 'deep',
      maxPages: 100
    });
    
    if (newTaskId) {
      startPolling();
    }
  };

  return (
    <div>
      <button onClick={handleStart}>Start Audit</button>
      {status && <div>Progress: {status.progress}%</div>}
    </div>
  );
}
```

### Получение списка аудитов

```typescript
import { useAuditList } from '@/modules/audit';

function AuditHistory() {
  const { audits, isLoading, refetch } = useAuditList();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {audits.map(audit => (
        <div key={audit.id}>
          <h3>{audit.url}</h3>
          <p>Score: {audit.seo_score}</p>
          <p>Status: {audit.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Запуск оптимизации

```typescript
import { useOptimization } from '@/modules/optimization';

function OptimizationPanel({ taskId }) {
  const { startOptimization, isLoading } = useOptimization();

  const handleOptimize = async () => {
    await startOptimization(taskId, {
      contentQuality: 'premium',
      fixMetaTags: true,
      improveContent: true
    });
  };

  return (
    <button onClick={handleOptimize} disabled={isLoading}>
      Optimize
    </button>
  );
}
```

### Работа с отчетами

```typescript
import { useReports, reportService } from '@/modules/reports';

function ReportsPage() {
  const { reports, refetch } = useReports();

  const handleDownload = async (report) => {
    const blob = await reportService.downloadReport(
      report.id, 
      report.file_path
    );
    
    // Создать ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.report_title || 'report.pdf';
    a.click();
  };

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>
          <h3>{report.report_title}</h3>
          <button onClick={() => handleDownload(report)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Интеграция с Backend

### Edge Functions

Новые модули работают с обновленными Edge Functions:

- ✅ `audit-start` - запуск аудита
- ✅ `audit-status` - статус аудита
- ✅ `audit-cancel` - отмена аудита
- ✅ `optimization-start` - запуск оптимизации
- ✅ `optimization-status` - статус оптимизации

### Таблицы БД

Новые модули работают с новыми таблицами:

- ✅ `audits` - основная таблица аудитов
- ✅ `audit_tasks` - задачи аудита (прогресс)
- ✅ `audit_results` - результаты аудитов
- ✅ `optimization_jobs` - задачи оптимизации
- ✅ `api_logs` - логи API вызовов
- ✅ `page_analysis` - анализ страниц (обновлена)

## Преимущества новой архитектуры

### 1. Модульность
- Каждый модуль независим
- Легко тестировать отдельно
- Простое переиспользование

### 2. Типизация
- Строгая типизация TypeScript
- Автокомплит в IDE
- Меньше ошибок во время выполнения

### 3. Централизованная логика
- Вся логика в одном месте
- Легко обновлять
- Избегаем дублирования кода

### 4. Лучшая интеграция с Backend
- Прямая работа с Edge Functions
- Использование новых таблиц БД
- Реальное сохранение данных

### 5. Масштабируемость
- Легко добавлять новые модули
- Простая интеграция новых функций
- Четкая структура проекта

## Следующие шаги

### Этап 4: Backend Edge Functions
- Создать `audit-processor` для серверного сканирования
- Создать `optimization-processor` для AI оптимизации
- Обновить существующие Edge Functions

### Этап 5: Миграция компонентов
- Обновить ScanContext для использования новых модулей
- Обновить OptimizationContext
- Обновить AuditDataContext

### Этап 6: Admin & Client Dashboards
- Создать компоненты Admin Dashboard
- Создать компоненты Client Dashboard
- Интегрировать с новыми модулями

## Устранение проблем

### Проблема: Старые данные не загружаются

**Решение:** Используйте fallback на старые методы:

```typescript
const { moduleContext, auditData } = useAuditContext();

// Попробовать загрузить из новой БД
const newData = moduleContext.audits[0];

// Fallback на старые данные
const data = newData || auditData;
```

### Проблема: taskId не синхронизирован

**Решение:** Используйте единый источник истины:

```typescript
const { taskId: oldTaskId, moduleContext } = useAuditContext();
const taskId = moduleContext.currentTaskId || oldTaskId;
```

### Проблема: Дублирование запросов

**Решение:** Отключайте старые запросы при использовании новых:

```typescript
const shouldUseNewArchitecture = true;

if (shouldUseNewArchitecture) {
  // Использовать новые методы
  await moduleContext.startAuditNew(url);
} else {
  // Использовать старые методы
  await startScan(false);
}
```

## Заключение

Новая модульная архитектура предоставляет:
- ✅ Лучшую организацию кода
- ✅ Улучшенную типизацию
- ✅ Реальную интеграцию с Backend
- ✅ Масштабируемость
- ✅ Обратную совместимость во время миграции

Следующий этап: создание серверных Edge Functions для сканирования и оптимизации.
