# Backend Edge Functions - Руководство

## Обзор

В Этапе 4 мы создали серверные Edge Functions для полного цикла работы с аудитами: от запуска до получения результатов.

## Архитектура Edge Functions

```
суpabase/functions/
├── audit-start/          # Запуск аудита
├── audit-status/         # Получение статуса
├── audit-cancel/         # Отмена аудита
├── audit-processor/      # Обработка аудита (сканирование + анализ)
├── optimization-start/   # Запуск оптимизации
└── optimization-status/  # Статус оптимизации
```

## 1. audit-start

**Назначение:** Создает запись в БД и запускает процесс сканирования.

**Метод:** POST  
**Аутентификация:** Required (JWT)  
**Таблицы:** `audits`, `audit_tasks`, `api_logs`

### Запрос:

```json
{
  "url": "https://example.com",
  "options": {
    "type": "quick" | "deep",
    "maxPages": 10
  }
}
```

### Ответ:

```json
{
  "success": true,
  "task_id": "uuid",
  "status": "queued",
  "message": "Audit started successfully"
}
```

### Процесс:

1. Проверяет авторизацию пользователя
2. Валидирует URL
3. Создает запись в `audits` (status: 'pending')
4. Создает запись в `audit_tasks` (status: 'queued')
5. Вызывает `audit-processor` для начала обработки
6. Логирует вызов в `api_logs`

---

## 2. audit-processor

**Назначение:** Сканирует сайт, анализирует страницы и сохраняет результаты.

**Метод:** POST  
**Аутентификация:** NOT Required (verify_jwt = false)  
**Таблицы:** `audit_tasks`, `audits`, `audit_results`, `page_analysis`

### Запрос:

```json
{
  "task_id": "uuid"
}
```

### Процесс:

1. **Инициализация** (progress: 0-10%)
   - Получает task из БД
   - Создает audit если не существует
   - Обновляет статус на 'scanning'

2. **Сканирование** (progress: 10-90%)
   - Парсит domain из URL
   - Создает очередь URL для сканирования
   - Сканирует страницы батчами (по 50 страниц)
   - Извлекает данные:
     - Title, meta description
     - H1 заголовки (количество)
     - Изображения (количество)
     - Слова (количество)
     - Время загрузки
     - HTTP статус код
     - Внутренние/внешние ссылки
   - Сохраняет каждую страницу в `page_analysis`
   - Обновляет прогресс в `audit_tasks`

3. **Анализ** (progress: 90-100%)
   - Анализирует SEO:
     - Отсутствующие title
     - Отсутствующие H1
     - Другие проблемы
   - Рассчитывает score (0-100)
   - Создает список items с проблемами

4. **Сохранение результатов**
   - Сохраняет в `audit_results`:
     - audit_data (JSONB)
     - score
     - page_count
     - issues_count
   - Обновляет `audits`:
     - status: 'completed'
     - pages_scanned
     - seo_score
     - completed_at
   - Обновляет `audit_tasks`:
     - status: 'completed'
     - progress: 100

### Особенности:

- **Background Task:** Использует `EdgeRuntime.waitUntil()` для фонового выполнения
- **Batch Processing:** Обрабатывает страницы батчами
- **Timeout Protection:** Останавливается через 50 секунд
- **Rate Limiting:** Задержка 100ms между запросами
- **Concurrent Requests:** Максимум 5 параллельных запросов

### Константы:

```typescript
const BATCH_SIZE = 50; // Страниц в одном батче
const MAX_EXECUTION_TIME = 50000; // 50 секунд
const CRAWL_DELAY = 100; // мс между запросами
const MAX_CONCURRENT_REQUESTS = 5; // Параллельных запросов
```

---

## 3. audit-status

**Назначение:** Получает текущий статус и прогресс аудита.

**Метод:** POST  
**Аутентификация:** Required (JWT)  
**Таблицы:** `audit_tasks`, `audit_results`

### Запрос:

```json
{
  "task_id": "uuid"
}
```

### Ответ:

```json
{
  "success": true,
  "task_id": "uuid",
  "url": "https://example.com",
  "status": "scanning",
  "progress": 45,
  "pages_scanned": 23,
  "total_pages": 50,
  "stage": "crawling",
  "current_url": "https://example.com/page-23",
  "error": null,
  "audit_data": null  // Только если status === 'completed'
}
```

### Статусы:

- `queued` - В очереди
- `scanning` - Сканирование
- `analyzing` - Анализ
- `completed` - Завершено
- `failed` - Ошибка
- `cancelled` - Отменено

### Stages:

- `initialization` - Инициализация
- `crawling` - Сканирование
- `analysis` - Анализ
- `completed` - Завершено
- `cancelled` - Отменено

---

## 4. audit-cancel

**Назначение:** Отменяет выполняющийся аудит.

**Метод:** POST  
**Аутентификация:** Required (JWT)  
**Таблицы:** `audit_tasks`, `audits`

### Запрос:

```json
{
  "task_id": "uuid"
}
```

### Ответ:

```json
{
  "success": true,
  "message": "Audit cancelled successfully"
}
```

### Процесс:

1. Получает task из БД
2. Обновляет `audit_tasks`:
   - status: 'cancelled'
   - error_message: 'Cancelled by user'
3. Обновляет `audits` (если существует):
   - status: 'failed'

---

## Интеграция с Frontend

### useAudit Hook

```typescript
import { useAudit } from '@/modules/audit';

function MyComponent() {
  const { startAudit, taskId } = useAudit();

  const handleStart = async () => {
    const newTaskId = await startAudit('https://example.com', {
      type: 'deep',
      maxPages: 100
    });
  };
}
```

### useAuditStatus Hook

```typescript
import { useAuditStatus } from '@/modules/audit';

function MyComponent({ taskId }) {
  const { status, startPolling } = useAuditStatus({
    taskId,
    onComplete: (data) => {
      console.log('Completed!', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  useEffect(() => {
    if (taskId) {
      startPolling();
    }
  }, [taskId]);

  return (
    <div>
      <p>Status: {status?.status}</p>
      <p>Progress: {status?.progress}%</p>
      <p>Pages: {status?.pages_scanned}/{status?.total_pages}</p>
    </div>
  );
}
```

---

## Таблицы БД

### audits

Основная таблица аудитов:

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pages_scanned INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  seo_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);
```

### audit_tasks

Задачи для отслеживания прогресса:

```sql
CREATE TABLE audit_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  url TEXT NOT NULL,
  task_type TEXT DEFAULT 'quick',
  status TEXT NOT NULL DEFAULT 'queued',
  stage TEXT DEFAULT 'initialization',
  progress INTEGER DEFAULT 0,
  pages_scanned INTEGER DEFAULT 0,
  estimated_pages INTEGER DEFAULT 0,
  current_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### audit_results

Результаты завершенных аудитов:

```sql
CREATE TABLE audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES audit_tasks(id),
  audit_id UUID REFERENCES audits(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  audit_data JSONB,
  score INTEGER,
  page_count INTEGER,
  issues_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### page_analysis

Анализ отдельных страниц:

```sql
CREATE TABLE page_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id),
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  h1_count INTEGER DEFAULT 0,
  image_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  load_time NUMERIC,
  status_code INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Логирование

Все вызовы API логируются в `api_logs`:

```sql
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  function_name TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Конфигурация (config.toml)

```toml
project_id = "dllusofuxonaemrttmwl"

[functions.audit-start]
verify_jwt = true

[functions.audit-status]
verify_jwt = true

[functions.audit-cancel]
verify_jwt = true

[functions.audit-processor]
verify_jwt = false  # Вызывается из audit-start

[functions.optimization-start]
verify_jwt = true

[functions.optimization-status]
verify_jwt = true
```

**ВАЖНО:** `audit-processor` не требует JWT, т.к. вызывается из `audit-start` с service role key.

---

## Безопасность

### RLS Политики

Все таблицы защищены Row Level Security:

```sql
-- Пользователи видят только свои аудиты
CREATE POLICY "Users can view their own audits"
  ON audits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Аналогично для других таблиц
```

### Аутентификация

- ✅ `audit-start`, `audit-status`, `audit-cancel` - требуют JWT
- ❌ `audit-processor` - не требует JWT (вызывается сервером)

---

## Мониторинг

### Просмотр логов

```typescript
import { adminService } from '@/modules/admin';

const logs = await adminService.getApiLogs(50);

logs.forEach(log => {
  console.log(`${log.function_name}: ${log.status_code} (${log.duration_ms}ms)`);
});
```

### Статистика

```typescript
import { useAdminStats } from '@/modules/admin';

const { stats } = useAdminStats();

console.log(`Total audits: ${stats.total_audits}`);
console.log(`Active audits: ${stats.active_audits}`);
console.log(`Average score: ${stats.average_seo_score}`);
```

---

## Следующие шаги

### Этап 5: Optimization Edge Functions
- Создать `optimization-processor` для AI оптимизации
- Интегрировать с Lovable AI
- Сохранять результаты в `optimization_jobs`

### Этап 6: Admin Dashboard
- Создать страницы администратора
- Просмотр всех аудитов
- Мониторинг системы
- Просмотр логов

### Этап 7: Client Dashboard
- Создать страницы клиента
- История аудитов
- Скачивание отчетов
- Управление профилем

---

## Устранение проблем

### Аудит не запускается

**Проверьте:**
1. Авторизация пользователя
2. Валидность URL
3. Логи в `api_logs`

### Аудит зависает

**Причины:**
1. Большой сайт (>maxPages)
2. Медленный ответ сайта
3. Ошибки сети

**Решение:**
- Уменьшить maxPages
- Увеличить timeout
- Проверить current_url в audit_tasks

### Неверные результаты

**Проверьте:**
1. Данные в `page_analysis`
2. Логику анализа в audit-processor
3. audit_data в `audit_results`

---

## Заключение

Edge Functions обеспечивают:
- ✅ Серверное сканирование
- ✅ Реальное сохранение данных
- ✅ Отслеживание прогресса
- ✅ Безопасность через RLS
- ✅ Масштабируемость
- ✅ Логирование

Все готово для интеграции с frontend и создания дашбордов!
