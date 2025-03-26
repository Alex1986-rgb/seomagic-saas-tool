
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface BeforeAfterData {
  category: string;
  before: number;
  after: number;
}

interface AnimatedGrowthChartProps {
  title: string;
  data: BeforeAfterData[];
  chartType?: 'area' | 'bar';
}

const AnimatedGrowthChart: React.FC<AnimatedGrowthChartProps> = ({ 
  title, 
  data,
  chartType = 'area'
}) => {
  const [showAfter, setShowAfter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const afterTimer = setTimeout(() => {
        setShowAfter(true);
      }, 1500);
      
      return () => clearTimeout(afterTimer);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate average improvement
  const averageImprovement = data.reduce((acc, item) => {
    return acc + (item.after - item.before);
  }, 0) / data.length;

  const percentageImprovement = data.reduce((acc, item) => {
    const pct = item.before > 0 ? ((item.after - item.before) / item.before) * 100 : 0;
    return acc + pct;
  }, 0) / data.length;

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="category" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip 
          formatter={(value: number) => [`${value}`, '']}
          labelFormatter={(label) => `Категория: ${label}`}
        />
        <Legend />
        
        <Area 
          type="monotone" 
          dataKey="before" 
          name="До" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill="url(#colorBefore)" 
          strokeWidth={2}
        />
        
        {showAfter && (
          <Area 
            type="monotone" 
            dataKey="after" 
            name="После" 
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorAfter)" 
            strokeWidth={2}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`${value}`, '']}
          labelFormatter={(label) => `Категория: ${label}`}
        />
        <Legend />
        <Bar dataKey="before" name="До" fill="#8884d8" />
        {showAfter && <Bar dataKey="after" name="После" fill="#82ca9d" />}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="neo-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="mb-6">
        {chartType === 'area' ? renderAreaChart() : renderBarChart()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <motion.div 
          className="p-4 border rounded-md bg-muted/30"
          initial={{ opacity: 0, x: -20 }}
          animate={isAnimating ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-lg font-medium text-center mb-2">До оптимизации</div>
          <div className="flex items-center justify-center text-3xl font-bold">
            {data.map(item => item.before).reduce((a, b) => a + b, 0) / data.length}
            <span className="text-sm ml-1 font-normal text-muted-foreground">ср. баллов</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="relative p-4 border rounded-md bg-muted/30"
          initial={{ opacity: 0, x: 20 }}
          animate={showAfter ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-lg font-medium text-center mb-2">После оптимизации</div>
          <div className="flex items-center justify-center text-3xl font-bold">
            {data.map(item => item.after).reduce((a, b) => a + b, 0) / data.length}
            <span className="text-sm ml-1 font-normal text-muted-foreground">ср. баллов</span>
          </div>
          
          <motion.div 
            className="absolute -top-3 -right-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm font-medium flex items-center"
            initial={{ scale: 0 }}
            animate={showAfter ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            +{percentageImprovement.toFixed(1)}%
          </motion.div>
        </motion.div>
      </div>
      
      {showAfter && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-lg">
            <span className="font-medium">Средний рост: </span>
            <span className="text-green-600 dark:text-green-400 font-bold">+{averageImprovement.toFixed(1)}</span>
            <span> баллов по всем категориям</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Оптимизация привела к значительному улучшению во всех ключевых метриках
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedGrowthChart;
