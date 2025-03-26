
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, 
  Line, LineChart, Pie, PieChart, ResponsiveContainer, 
  Sector, Tooltip, XAxis, YAxis, Cell 
} from 'recharts';
import { ChevronDown, ChevronUp, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditCategoryData } from '@/types/audit';

interface AuditDataVisualizerProps {
  auditData: {
    seo: AuditCategoryData;
    performance: AuditCategoryData;
    content: AuditCategoryData;
    technical: AuditCategoryData;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AuditDataVisualizer: React.FC<AuditDataVisualizerProps> = ({ auditData }) => {
  const [expanded, setExpanded] = useState(false);

  // Преобразование данных для визуализации
  const prepareScoreData = () => {
    return [
      { name: 'SEO', score: auditData.seo.score },
      { name: 'Производительность', score: auditData.performance.score },
      { name: 'Контент', score: auditData.content.score },
      { name: 'Технические аспекты', score: auditData.technical.score }
    ];
  };

  // Подготовка данных о проблемах для круговой диаграммы
  const prepareIssuesData = () => {
    const issuesByCategory = [
      { name: 'SEO', value: countIssues(auditData.seo) },
      { name: 'Производительность', value: countIssues(auditData.performance) },
      { name: 'Контент', value: countIssues(auditData.content) },
      { name: 'Технические аспекты', value: countIssues(auditData.technical) }
    ];
    // Фильтрация категорий с нулевыми значениями
    return issuesByCategory.filter(item => item.value > 0);
  };

  // Подсчет проблем по категории
  const countIssues = (category: AuditCategoryData) => {
    return category.items.filter(item => item.status !== 'good').length;
  };

  // Рендер активного сектора для круговой диаграммы
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333">
          {`${value} проблем`}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Визуализация данных аудита
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </h2>
      </div>

      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="bars" className="mt-4">
          <TabsList className="mb-4 grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="bars" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span>Оценки</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Проблемы</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Тренды</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bars" className="mt-2">
            <div className="p-4 border rounded-md">
              <h3 className="text-md font-medium mb-4 text-center">Оценки по категориям</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareScoreData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}`, 'Оценка']} />
                  <Bar dataKey="score" isAnimationActive={true} animationDuration={1000}>
                    {prepareScoreData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.score >= 80 ? '#22c55e' : // зеленый
                        entry.score >= 60 ? '#f59e0b' : // оранжевый
                        '#ef4444' // красный
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-2">
            <div className="p-4 border rounded-md">
              <h3 className="text-md font-medium mb-4 text-center">Распределение проблем</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={prepareIssuesData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {prepareIssuesData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} проблем`, 'Количество']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-2">
            <div className="p-4 border rounded-md">
              <h3 className="text-md font-medium mb-4 text-center">Динамика по категориям</h3>
              <p className="text-center text-muted-foreground text-sm mb-4">
                Этот график будет показывать изменения оценок со временем при наличии исторических данных.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { date: '01.01', seo: 50, performance: 40, content: 60, technical: 30 },
                    { date: '01.15', seo: 55, performance: 45, content: 62, technical: 35 },
                    { date: '02.01', seo: 60, performance: 55, content: 65, technical: 40 },
                    { date: '02.15', seo: 70, performance: 65, content: 70, technical: 50 },
                    { date: '03.01', seo: 75, performance: 75, content: 75, technical: 65 },
                    { date: 'Текущий', seo: auditData.seo.score, performance: auditData.performance.score, content: auditData.content.score, technical: auditData.technical.score },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff8042" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="seo" stroke="#8884d8" fillOpacity={1} fill="url(#colorSeo)" name="SEO" />
                  <Area type="monotone" dataKey="performance" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPerf)" name="Производительность" />
                  <Area type="monotone" dataKey="content" stroke="#ffc658" fillOpacity={1} fill="url(#colorContent)" name="Контент" />
                  <Area type="monotone" dataKey="technical" stroke="#ff8042" fillOpacity={1} fill="url(#colorTech)" name="Технические аспекты" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuditDataVisualizer;
