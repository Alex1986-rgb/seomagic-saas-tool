# Модульная архитектура Frontend

## Обзор

Проект разделен на 5 основных модулей для лучшей организации кода и maintainability:

- **Audit** - управление SEO аудитами
- **Optimization** - оптимизация контента
- **Reports** - генерация и управление отчетами
- **Admin** - административная панель
- **Client** - клиентский кабинет

## Структура модулей

Каждый модуль имеет следующую структуру:

```
src/modules/{module-name}/
├── components/      # React компоненты модуля
├── hooks/          # Custom React hooks
├── services/       # Бизнес-логика и API вызовы
├── types/          # TypeScript типы
└── index.ts        # Публичный API модуля
```

---

## 1. Модуль Audit

**Путь:** `src/modules/audit/`

### Назначение
Управление SEO аудитами сайтов - запуск, отслеживание прогресса, получение результатов.

### Основные компоненты:
- `auditService` - сервис для работы с аудитами
- `useAudit` - хук для запуска аудитов
- `useAuditStatus` - хук для отслеживания статуса
- `useAuditList` - хук для списка аудитов

### Типы:
- `Audit` - основная информация об аудите
- `AuditTask` - задача аудита (для отслеживания прогресса)
- `AuditResult` - результаты аудита
- `StartAuditOptions` - опции запуска аудита

### Пример использования:

```typescript
import { useAudit, useAuditStatus } from '@/modules/audit';

function AuditPage() {
  const { startAudit, isLoading } = useAudit();
  const { status, startPolling } = useAuditStatus({
    taskId,
    onComplete: (data) => console.log('Audit completed:', data)
  });

  const handleStart = async () => {
    const taskId = await startAudit('https://example.com', {
      type: 'deep',
      maxPages: 100
    });
    if (taskId) startPolling();
  };

  return (
    <div>
      <button onClick={handleStart} disabled={isLoading}>
        Start Audit
      </button>
      {status && <div>Progress: {status.progress}%</div>}
    </div>
  );
}
```

---

## 2. Модуль Optimization

**Путь:** `src/modules/optimization/`

### Назначение
Оптимизация контента сайта с использованием AI.

### Основные компоненты:
- `optimizationService` - сервис для работы с оптимизацией
- `useOptimization` - хук для запуска оптимизации

### Типы:
- `OptimizationJob` - задача оптимизации
- `OptimizationOptions` - опции оптимизации
- `OptimizationResult` - результаты оптимизации
- `OptimizationMetrics` - метрики и стоимость

### Пример использования:

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
      Optimize Content
    </button>
  );
}
```

---

## 3. Модуль Reports

**Путь:** `src/modules/reports/`

### Назначение
Генерация, хранение и скачивание отчетов.

### Основные компоненты:
- `reportService` - сервис для работы с отчетами
- `useReports` - хук для списка отчетов

### Типы:
- `Report` - информация об отчете
- `ReportGenerationOptions` - опции генерации
- `ReportSection` - секция отчета

### Пример использования:

```typescript
import { useReports, reportService } from '@/modules/reports';

function ReportsPage() {
  const { reports, isLoading, refetch } = useReports();

  const handleDownload = async (reportId, filePath) => {
    const blob = await reportService.downloadReport(reportId, filePath);
    // Скачать blob
  };

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>
          <h3>{report.report_title}</h3>
          <button onClick={() => handleDownload(report.id, report.file_path)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Модуль Admin

**Путь:** `src/modules/admin/`

### Назначение
Административная панель для управления пользователями, мониторинга системы.

### Основные компоненты:
- `adminService` - сервис для админ-функций
- `useAdminStats` - хук для системной статистики

### Типы:
- `AdminUser` - информация о пользователе
- `AdminStats` - системная статистика
- `ApiLog` - лог API вызова

### Пример использования:

```typescript
import { useAdminStats, adminService } from '@/modules/admin';

function AdminDashboard() {
  const { stats, isLoading } = useAdminStats();

  return (
    <div>
      <h2>System Statistics</h2>
      {stats && (
        <div>
          <p>Total Users: {stats.total_users}</p>
          <p>Total Audits: {stats.total_audits}</p>
          <p>Avg SEO Score: {stats.average_seo_score}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Модуль Client

**Путь:** `src/modules/client/`

### Назначение
Клиентский кабинет - профиль пользователя, его аудиты и отчеты.

### Основные компоненты:
- `clientService` - сервис для клиентских функций
- `useClientProfile` - хук для профиля пользователя

### Типы:
- `ClientProfile` - профиль пользователя
- `ClientDashboardStats` - статистика клиента

### Пример использования:

```typescript
import { useClientProfile, clientService } from '@/modules/client';

function ClientProfile() {
  const { profile, isLoading } = useClientProfile();

  const handleUpdate = async () => {
    await clientService.updateProfile({
      full_name: 'New Name'
    });
  };

  return (
    <div>
      {profile && (
        <div>
          <h2>{profile.full_name}</h2>
          <p>{profile.email}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Принципы работы с модулями

### 1. Импорт через index.ts
Всегда импортируйте из корня модуля:

```typescript
// ✅ Правильно
import { useAudit, auditService } from '@/modules/audit';

// ❌ Неправильно
import { useAudit } from '@/modules/audit/hooks/useAudit';
```

### 2. Разделение ответственности
- **Services** - бизнес-логика и API вызовы
- **Hooks** - React-специфичная логика
- **Types** - типы TypeScript
- **Components** - UI компоненты (будут добавлены в следующих этапах)

### 3. Использование Supabase
Все сервисы используют:
- `supabase.functions.invoke()` для вызова Edge Functions
- `supabase.from()` для прямых запросов к таблицам

### 4. Обработка ошибок
Все сервисы и хуки включают обработку ошибок:

```typescript
try {
  const data = await service.method();
  return data;
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

---

## Следующие шаги

### Этап 3: Интеграция Frontend-Backend
- Обновить существующие компоненты для использования новых модулей
- Мигрировать с firecrawlService на backend Edge Functions
- Реализовать polling для отслеживания статуса

### Этап 4: Backend Edge Functions
- Создать audit-processor для серверного сканирования
- Создать optimization-processor для AI оптимизации
- Обновить существующие Edge Functions

### Этап 5-6: Dashboard компоненты
- Создать компоненты для Admin Dashboard
- Создать компоненты для Client Dashboard

---

## Преимущества модульной архитектуры

✅ **Организация** - четкая структура кода  
✅ **Переиспользование** - легко использовать логику в разных местах  
✅ **Тестирование** - проще писать unit тесты  
✅ **Масштабирование** - легко добавлять новые модули  
✅ **Maintainability** - проще поддерживать и обновлять код  

---

## Интеграция с существующим кодом

Старый код постепенно мигрирует на новую модульную структуру:

```typescript
// Старый подход (в src/services/)
import { auditService } from '@/services/auditService';

// Новый подход (в src/modules/)
import { auditService } from '@/modules/audit';
```

Обе версии могут работать параллельно во время миграции.
