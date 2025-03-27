
export const mockAudits = [
  {
    id: '1',
    url: 'example.com',
    score: 86,
    date: '2023-09-18T10:00:00',
    issues: { critical: 0, important: 2, minor: 5 }
  },
  {
    id: '2',
    url: 'myarredo.ru',
    score: 78,
    date: '2023-09-15T14:30:00',
    issues: { critical: 1, important: 3, minor: 7 }
  },
  {
    id: '3',
    url: 'mywebsite.org',
    score: 64,
    date: '2023-09-10T09:15:00',
    issues: { critical: 3, important: 5, minor: 9 }
  },
  {
    id: '4',
    url: 'ecommerce.store',
    score: 92,
    date: '2023-09-05T16:45:00',
    issues: { critical: 0, important: 1, minor: 3 }
  },
  {
    id: '5',
    url: 'blog.example.com',
    score: 73,
    date: '2023-09-01T11:20:00',
    issues: { critical: 2, important: 4, minor: 8 }
  }
];

export const mockSites = [
  {
    url: 'example.com',
    lastOptimized: '2023-09-10',
    score: 86
  },
  {
    url: 'myarredo.ru',
    lastOptimized: '2023-09-05',
    score: 78
  },
  {
    url: 'mywebsite.org',
    lastOptimized: '2023-08-29',
    score: 64
  },
  {
    url: 'ecommerce.store',
    lastOptimized: '2023-09-15',
    score: 92
  }
];

export const mockReports = [
  {
    id: '1',
    title: 'Ежемесячный отчет по SEO',
    date: '2023-09-01',
    sites: ['example.com', 'myarredo.ru'],
    metrics: { impressions: 15670, clicks: 2340, position: 18.4 }
  },
  {
    id: '2',
    title: 'Анализ конкурентов',
    date: '2023-08-15',
    sites: ['example.com'],
    metrics: { competitors: 5, gap: 12, opportunities: 24 }
  },
  {
    id: '3',
    title: 'Технический аудит',
    date: '2023-08-01',
    sites: ['mywebsite.org'],
    metrics: { issues: 14, fixed: 8, pending: 6 }
  }
];

export const mockKeywords = [
  { keyword: 'SEO аудит', position: 4, change: 2 },
  { keyword: 'оптимизация сайта', position: 7, change: -1 },
  { keyword: 'анализ сайта', position: 12, change: 3 },
  { keyword: 'продвижение в топ', position: 18, change: 5 },
  { keyword: 'SEO сервис', position: 2, change: 1 }
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Завершен аудит сайта',
    message: 'Аудит для myarredo.ru завершен. SEO оценка составила 78/100.',
    date: '2023-09-15T10:30:00',
    read: false
  },
  {
    id: '2',
    title: 'Новые рекомендации',
    message: 'Доступны новые рекомендации по оптимизации для сайта example.com',
    date: '2023-09-14T14:45:00',
    read: false
  },
  {
    id: '3',
    title: 'Обнаружены проблемы',
    message: 'На сайте mysite.ru обнаружены проблемы с индексацией. Требуется внимание.',
    date: '2023-09-12T09:15:00',
    read: true
  }
];
