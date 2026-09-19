
import * as z from 'zod';

export const positionTrackerFormSchema = z.object({
  domain: z.string().min(1, { message: 'Доменное имя обязательно' }),
  searchEngine: z.enum(['google', 'yandex', 'all'], {
    required_error: 'Выберите поисковую систему',
  }),
  region: z.string().optional(),
  // Глубже 100 сервер не проверяет (positions-check ограничивает глубину).
  depth: z.coerce.number().min(10).max(100).default(100),
  scanFrequency: z.enum(['once', 'daily', 'weekly', 'monthly']).default('once'),
});

export type FormData = z.infer<typeof positionTrackerFormSchema>;
