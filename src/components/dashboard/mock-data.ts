
export const mockAudits = [
  {
    id: '1',
    url: 'https://example.com',
    date: '2023-09-15T14:30:00Z',
    score: 67,
    status: 'completed',
  },
  {
    id: '2',
    url: 'https://company-blog.net',
    date: '2023-09-10T09:15:00Z',
    score: 84,
    status: 'completed',
  },
  {
    id: '3',
    url: 'https://e-store.example',
    date: '2023-09-05T18:45:00Z',
    score: 42,
    status: 'completed',
  },
  {
    id: '4',
    url: 'https://new-project.com',
    date: '2023-09-01T11:20:00Z',
    score: null,
    status: 'processing',
  },
];

export const mockUserAudits = [
  {
    id: '1',
    url: 'https://example.com',
    score: 78,
    date: '2023-06-08T14:30:00Z',
    status: 'completed',
    issues: { critical: 3, important: 8, opportunities: 12 },
    optimized: true,
  },
  {
    id: '2',
    url: 'https://mywebsite.ru',
    score: 45,
    date: '2023-06-07T09:15:00Z',
    status: 'completed',
    issues: { critical: 12, important: 15, opportunities: 7 },
    optimized: false,
  },
  {
    id: '3',
    url: 'https://shop.example.com',
    score: 92,
    date: '2023-06-06T10:20:00Z',
    status: 'completed',
    issues: { critical: 0, important: 4, opportunities: 8 },
    optimized: true,
  },
  {
    id: '4',
    url: 'https://blog.mywebsite.ru',
    score: null,
    date: '2023-06-08T16:45:00Z',
    status: 'processing',
    issues: null,
    optimized: false,
  },
];
