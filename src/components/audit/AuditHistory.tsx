
import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuditHistoryItem } from '@/types/audit';
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AuditHistoryProps {
  historyItems: AuditHistoryItem[];
  onSelectAudit?: (auditId: string) => void;
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ historyItems, onSelectAudit }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!historyItems || historyItems.length < 2) {
    return null;
  }
  
  // Подготовка данных для графика
  const chartData = [...historyItems]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      score: item.score,
      id: item.id
    }));
  
  const latestAudit = historyItems[historyItems.length - 1];
  const previousAudit = historyItems.length > 1 ? historyItems[historyItems.length - 2] : null;
  
  const scoreDifference = previousAudit ? latestAudit.score - previousAudit.score : 0;
  const isImproved = scoreDifference > 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Handle dot click event
  const handleDotClick = (data: any) => {
    if (onSelectAudit && data && data.id) {
      onSelectAudit(data.id);
    }
  };

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">История аудитов</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {previousAudit && (
            <div className={`flex items-center gap-1 text-sm ${isImproved ? 'text-green-500' : 'text-red-500'}`}>
              {isImproved ? (
                <>
                  <TrendingUp className="h-4 w-4" />
                  <span>+{scoreDifference} баллов</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4" />
                  <span>{scoreDifference} баллов</span>
                </>
              )}
            </div>
          )}
          
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value} баллов`, 'Оценка']}
                    labelFormatter={(label) => `Дата: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="rgba(var(--primary-rgb))" 
                    fill="rgba(var(--primary-rgb), 0.1)" 
                    activeDot={{ 
                      r: 6, 
                      onClick: (_, event) => {
                        if (event && event.payload) {
                          handleDotClick(event.payload);
                        }
                      }
                    }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Дата</th>
                    <th className="p-2 text-left">Оценка</th>
                    <th className="p-2 text-left">Изменение</th>
                    <th className="p-2 text-left">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {[...historyItems]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item, index, arr) => {
                      const prevItem = index < arr.length - 1 ? arr[index + 1] : null;
                      const diff = prevItem ? item.score - prevItem.score : 0;
                      
                      return (
                        <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-2">{formatDate(item.date)}</td>
                          <td className="p-2 font-medium">{item.score}</td>
                          <td className="p-2">
                            {index < arr.length - 1 && (
                              <span className={`flex items-center gap-1 ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                                {diff > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                <span>{diff > 0 ? '+' : ''}{diff}</span>
                              </span>
                            )}
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onSelectAudit && onSelectAudit(item.id)}
                            >
                              Просмотр
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditHistory;
