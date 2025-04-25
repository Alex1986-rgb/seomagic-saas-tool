
import { Payment } from './types';

export const mockPayments: Payment[] = [
  {
    id: 'INV-001',
    user: { name: 'Иван Петров', email: 'ivan@example.com' },
    amount: 2900,
    date: '2023-06-05T10:30:00Z',
    status: 'completed',
    plan: 'pro',
    method: 'card',
  },
  {
    id: 'INV-002',
    user: { name: 'Анна Сидорова', email: 'anna@example.com' },
    amount: 990,
    date: '2023-06-02T14:15:00Z',
    status: 'completed',
    plan: 'basic',
    method: 'card',
  },
  {
    id: 'INV-003',
    user: { name: 'Петр Иванов', email: 'petr@example.com' },
    amount: 990,
    date: '2023-06-01T09:45:00Z',
    status: 'failed',
    plan: 'basic',
    method: 'card',
  },
  {
    id: 'INV-004',
    user: { name: 'Ольга Смирнова', email: 'olga@example.com' },
    amount: 2900,
    date: '2023-05-28T16:20:00Z',
    status: 'completed',
    plan: 'pro',
    method: 'paypal',
  },
  {
    id: 'INV-005',
    user: { name: 'Алексей Козлов', email: 'alex@example.com' },
    amount: 9900,
    date: '2023-05-25T11:10:00Z',
    status: 'pending',
    plan: 'agency',
    method: 'bank',
  },
];
