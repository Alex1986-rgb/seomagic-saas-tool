
import * as z from 'zod';

export const positionTrackerFormSchema = z.object({
  domain: z.string().min(1, { message: 'Доменное имя обязательно' }),
  searchEngine: z.enum(['google', 'yandex', 'mailru', 'all'], {
    required_error: 'Выберите поисковую систему',
  }),
  region: z.string().optional(),
  depth: z.coerce.number().min(10).max(1000).default(100),
  scanFrequency: z.enum(['once', 'daily', 'weekly', 'monthly']).default('once'),
  useProxy: z.boolean().default(false),
});

export type FormData = z.infer<typeof positionTrackerFormSchema>;
