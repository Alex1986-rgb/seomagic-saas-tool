
export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  views: number;
}

export const guides: Guide[] = [
  {
    id: "1",
    title: "Настройка отслеживания позиций сайта",
    description: "Пошаговое руководство по настройке отслеживания позиций вашего сайта в поисковых системах",
    category: "Отслеживание позиций",
    level: "Начинающий",
    author: "Алексей Петров",
    date: "10 мая 2025",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHNlYXJjaCUyMGVuZ2luZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "5 минут",
    views: 1234
  },
  {
    id: "2",
    title: "Анализ конкурентов и их SEO стратегий",
    description: "Как анализировать SEO стратегии конкурентов и использовать полученные данные для улучшения своего сайта",
    category: "Аналитика",
    level: "Средний",
    author: "Мария Иванова",
    date: "3 мая 2025",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcGV0aXRvcnN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "10 минут",
    views: 982
  },
  {
    id: "3",
    title: "Оптимизация контента для улучшения рейтинга в поисковых системах",
    description: "Пошаговое руководство по созданию и оптимизации контента, который будет высоко ранжироваться в поисковых системах",
    category: "Контент",
    level: "Продвинутый",
    author: "Дмитрий Соколов",
    date: "27 апреля 2025",
    image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGNvbnRlbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "15 минут",
    views: 1567
  },
  {
    id: "4",
    title: "Ускорение загрузки сайта и оптимизация Core Web Vitals",
    description: "Техническое руководство по улучшению скорости загрузки сайта и оптимизации показателей Core Web Vitals",
    category: "Техническая оптимизация",
    level: "Продвинутый",
    author: "Александр Волков",
    date: "21 апреля 2025",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHNwZWVkfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "12 минут",
    views: 2341
  },
  {
    id: "5",
    title: "Локальное SEO для малого бизнеса",
    description: "Как настроить и оптимизировать локальное SEO для привлечения клиентов из вашего региона",
    category: "Локальное SEO",
    level: "Начинающий",
    author: "Анна Смирнова",
    date: "15 апреля 2025",
    image: "https://images.unsplash.com/photo-1534216511603-a359ae43bc54?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvY2FsJTIwYnVzaW5lc3N8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "8 минут",
    views: 1120
  },
  {
    id: "6",
    title: "Построение стратегии линкбилдинга",
    description: "Эффективные методы и инструменты для построения качественной ссылочной массы",
    category: "Линкбилдинг",
    level: "Средний",
    author: "Максим Кузнецов",
    date: "9 апреля 2025",
    image: "https://images.unsplash.com/photo-1550063873-ab792950096b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bGlua3N8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    readTime: "11 минут",
    views: 967
  }
];
