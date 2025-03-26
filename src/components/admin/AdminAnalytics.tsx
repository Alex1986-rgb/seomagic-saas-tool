
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Мок-данные для графиков
const auditData = [
  { name: '01.01', value: 12 },
  { name: '02.01', value: 19 },
  { name: '03.01', value: 15 },
  { name: '04.01', value: 27 },
  { name: '05.01', value: 32 },
  { name: '06.01', value: 24 },
  { name: '07.01', value: 38 },
];

const userRegistrations = [
  { name: 'Янв', unauthenticated: 65, free: 28, basic: 15, pro: 8 },
  { name: 'Фев', unauthenticated: 59, free: 32, basic: 17, pro: 10 },
  { name: 'Мар', unauthenticated: 80, free: 41, basic: 24, pro: 12 },
  { name: 'Апр', unauthenticated: 81, free: 45, basic: 28, pro: 14 },
  { name: 'Май', unauthenticated: 76, free: 48, basic: 31, pro: 17 },
  { name: 'Июн', unauthenticated: 85, free: 53, basic: 33, pro: 19 },
];

const AdminAnalytics: React.FC = () => {
  const StatCard = ({ title, value, subtext, trend = 0 }) => (
    <div className="p-6 neo-card">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold">{value}</p>
        {trend !== 0 && (
          <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Всего аудитов" 
          value="1,248" 
          subtext="С начала работы" 
          trend={24}
        />
        <StatCard 
          title="Активные пользователи" 
          value="347" 
          subtext="За последние 30 дней" 
          trend={12}
        />
        <StatCard 
          title="Оптимизированные сайты" 
          value="856" 
          subtext="Клонов создано" 
          trend={18}
        />
        <StatCard 
          title="Доход" 
          value="₽284,500" 
          subtext="Текущий месяц" 
          trend={-3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Аудиты по дням</h3>
          <div className="h-80 neo-card p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={auditData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Пользователи по тарифам</h3>
          <div className="h-80 neo-card p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="unauthenticated" name="Без авторизации" fill="#94a3b8" />
                <Bar dataKey="free" name="Бесплатный" fill="#60a5fa" />
                <Bar dataKey="basic" name="Базовый" fill="#34d399" />
                <Bar dataKey="pro" name="Про" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
