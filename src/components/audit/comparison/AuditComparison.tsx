
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp, ArrowRight, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditHistoryItem } from '@/types/audit';

interface AuditComparisonProps {
  currentAudit: {
    id: string;
    score: number;
    date: string;
    details: {
      seo: { score: number };
      performance: { score: number };
      content: { score: number };
      technical: { score: number };
    };
  };
  historyItems: AuditHistoryItem[];
}

const AuditComparison: React.FC<AuditComparisonProps> = ({ currentAudit, historyItems }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  // Найти выбранный аудит в истории
  const selectedAudit = historyItems.find(item => item.id === selectedAuditId);

  // Подготовка данных для сравнения
  const prepareComparisonData = () => {
    if (!selectedAudit || !selectedAudit.details) return [];

    return [
      {
        name: 'Общий балл',
        текущий: currentAudit.score,
        предыдущий: selectedAudit.score,
      },
      {
        name: 'SEO',
        текущий: currentAudit.details.seo.score,
        предыдущий: selectedAudit.details?.seo?.score || 0,
      },
      {
        name: 'Производительность',
        текущий: currentAudit.details.performance.score,
        предыдущий: selectedAudit.details?.performance?.score || 0,
      },
      {
        name: 'Контент',
        текущий: currentAudit.details.content.score,
        предыдущий: selectedAudit.details?.content?.score || 0,
      },
      {
        name: 'Технические аспекты',
        текущий: currentAudit.details.technical.score,
        предыдущий: selectedAudit.details?.technical?.score || 0,
      }
    ];
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Вычисление изменения в оценке
  const getScoreDifference = () => {
    if (!selectedAudit) return null;
    
    const diff = currentAudit.score - selectedAudit.score;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      isNeutral: diff === 0
    };
  };

  const scoreDiff = getScoreDifference();

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Сравнение аудитов
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
        {historyItems.length > 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground mb-2">Выберите аудит для сравнения:</p>
                <Select onValueChange={(value) => setSelectedAuditId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите аудит" />
                  </SelectTrigger>
                  <SelectContent>
                    {historyItems
                      .filter(item => item.id !== currentAudit.id)
                      .map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {formatDate(item.date)} - Оценка: {item.score}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {selectedAudit && (
                <>
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Предыдущий аудит</p>
                        <p className="text-2xl font-bold">{selectedAudit.score}</p>
                        <p className="text-xs text-muted-foreground">
                          <CalendarDays className="inline h-3 w-3 mr-1" />
                          {formatDate(selectedAudit.date)}
                        </p>
                      </div>
                      
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Текущий аудит</p>
                        <p className="text-2xl font-bold">{currentAudit.score}</p>
                        <p className="text-xs text-muted-foreground">
                          <CalendarDays className="inline h-3 w-3 mr-1" />
                          {formatDate(currentAudit.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    {scoreDiff && (
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">Изменение оценки:</p>
                        <p className={`text-2xl font-bold ${
                          scoreDiff.isNeutral 
                            ? 'text-gray-500' 
                            : scoreDiff.isPositive 
                              ? 'text-green-500' 
                              : 'text-red-500'
                        }`}>
                          {scoreDiff.isNeutral 
                            ? 'Без изменений' 
                            : `${scoreDiff.isPositive ? '+' : '-'}${scoreDiff.value}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {scoreDiff.isNeutral 
                            ? 'Оценка не изменилась' 
                            : scoreDiff.isPositive 
                              ? 'Улучшение' 
                              : 'Ухудшение'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {selectedAudit && (
              <div className="mt-6">
                <Tabs defaultValue="chart">
                  <TabsList className="mb-4 grid grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="chart">График сравнения</TabsTrigger>
                    <TabsTrigger value="details">Детали изменений</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart">
                    <div className="p-4 bg-background rounded-md border">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={prepareComparisonData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value) => [`${value}`, 'Оценка']}
                            itemSorter={(item) => -item.value}
                          />
                          <Legend />
                          <Bar dataKey="текущий" name="Текущий аудит" fill="#8884d8" />
                          <Bar dataKey="предыдущий" name="Предыдущий аудит" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="p-4 bg-background rounded-md border">
                      <h3 className="text-md font-medium mb-4">Детальное сравнение результатов</h3>
                      <div className="space-y-4">
                        {prepareComparisonData().map((item, index) => {
                          const diff = item.текущий - item.предыдущий;
                          return (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <div className="flex gap-4 text-sm mt-1">
                                  <span className="text-muted-foreground">Было: {item.предыдущий}</span>
                                  <span className="text-muted-foreground">Сейчас: {item.текущий}</span>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded ${
                                diff === 0 
                                  ? 'bg-gray-100 text-gray-500' 
                                  : diff > 0 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'
                              }`}>
                                {diff === 0 ? 'Без изменений' : (diff > 0 ? '+' : '') + diff}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg text-muted-foreground">Для сравнения необходимо иметь как минимум два аудита.</p>
            <p className="text-muted-foreground mt-2">Проведите дополнительные аудиты, чтобы увидеть сравнение результатов.</p>
            <Button className="mt-4">Запустить новый аудит</Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuditComparison;
