
import React from "react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const registrationData = [
  { month: 'Янв', count: 4 },
  { month: 'Фев', count: 6 },
  { month: 'Мар', count: 8 },
  { month: 'Апр', count: 5 },
  { month: 'Май', count: 12 },
  { month: 'Июн', count: 8 },
  { month: 'Июл', count: 15 },
  { month: 'Авг', count: 18 },
  { month: 'Сен', count: 10 },
  { month: 'Окт', count: 11 },
  { month: 'Ноя', count: 14 },
  { month: 'Дек', count: 16 },
];

const userTypeData = [
  { name: 'Пользователи', value: 72 },
  { name: 'Администраторы', value: 5 },
  { name: 'Модераторы', value: 12 },
  { name: 'Аналитики', value: 8 },
];

const activeUsersData = [
  { day: 'Пн', active: 32 },
  { day: 'Вт', active: 38 },
  { day: 'Ср', active: 35 },
  { day: 'Чт', active: 42 },
  { day: 'Пт', active: 45 },
  { day: 'Сб', active: 20 },
  { day: 'Вс', active: 15 },
];

const COLORS = ['#8B5CF6', '#36CFFF', '#14CC8C', '#FFBB28'];

const darkShadow = "0 6px 32px 0 rgba(34,33,67,0.22)";

const UserCharts: React.FC = () => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 my-10">
    {/* Линейный график по регистрациям */}
    <div className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#221F26]/95 via-[#23263B]/95 to-[#191B22]/90 border-none" style={{ boxShadow: darkShadow }}>
      <div className="font-semibold text-lg mb-4 text-gradient bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">Регистрации по месяцам</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={registrationData}>
          <XAxis dataKey="month" stroke="#b2b6cf" />
          <YAxis stroke="#b2b6cf" />
          <Tooltip contentStyle={{ background: '#221F26', border: 'none', color: '#fff' }} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} name="Регистрации" dot={{ r: 4, stroke: "#fff", strokeWidth: 1 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Круговая диаграмма по типам пользователей */}
    <div className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#23263B]/95 via-[#191B22]/90 to-[#28213a]/95 border-none" style={{ boxShadow: darkShadow }}>
      <div className="font-semibold text-lg mb-4 text-gradient bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#14CC8C] bg-clip-text text-transparent">
        Распределение пользователей по ролям
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={userTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={75}
            fill="#8B5CF6"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {userTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#23263B', border: 'none', color: '#fff' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Столбчатый график активности */}
    <div className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#191B22]/95 via-[#28213a]/80 to-[#23263B]/95 border-none" style={{ boxShadow: darkShadow }}>
      <div className="font-semibold text-lg mb-4 text-gradient bg-gradient-to-r from-[#36CFFF] via-[#14CC8C] to-[#8B5CF6] bg-clip-text text-transparent">
        Активные пользователи по дням недели
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={activeUsersData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#23263B" />
          <XAxis dataKey="day" stroke="#b2b6cf" />
          <YAxis stroke="#b2b6cf" />
          <Tooltip contentStyle={{ background: '#23263B', border: 'none', color: '#fff' }} />
          <Legend />
          <Bar dataKey="active" name="Активные" fill="#36CFFF" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default UserCharts;
