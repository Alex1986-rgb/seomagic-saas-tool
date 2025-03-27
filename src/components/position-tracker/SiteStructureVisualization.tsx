import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileTree, BarChart3, Download, Network, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { analyzeSiteStructure, type PageNode } from '@/services/audit/siteAnalysis';
import { ResponsiveContainer, Treemap, Tooltip as RechartsTooltip } from 'recharts';

interface SiteStructureVisualizationProps {
  domain?: string;
  className?: string;
}

export function SiteStructureVisualization({ domain, className = '' }: SiteStructureVisualizationProps) {
  const [domainInput, setDomainInput] = useState(domain || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nodes, setNodes] = useState<PageNode[]>([]);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const analyzeSiteStructure = async () => {
    if (!domainInput) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите домен для анализа",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setNodes([]);

    try {
      await simulateAnalysis();
      
      toast({
        title: "Анализ завершен",
        description: "Структура сайта успешно проанализирована",
      });
    } catch (error) {
      console.error("Ошибка анализа:", error);
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе структуры сайта",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const simulateAnalysis = async () => {
    const sectionNames = ['about', 'products', 'services', 'blog', 'contact', 'careers', 'support'];
    const generatedNodes: PageNode[] = [];
    
    generatedNodes.push({
      url: `https://${domainInput}/`,
      title: `${domainInput} - Главная страница`,
      incomingLinks: 0,
      outgoingLinks: sectionNames.length,
      pageRank: 100,
      level: 0
    });
    
    for (const section of sectionNames) {
      const pagesInSection = Math.floor(Math.random() * 5) + 2;
      const pageRank = Math.floor(Math.random() * 40) + 30;
      
      generatedNodes.push({
        url: `https://${domainInput}/${section}/`,
        title: `${section.charAt(0).toUpperCase() + section.slice(1)} - ${domainInput}`,
        incomingLinks: 1,
        outgoingLinks: pagesInSection,
        pageRank: pageRank,
        level: 1
      });
      
      for (let i = 1; i <= pagesInSection; i++) {
        const subPageRank = Math.floor(Math.random() * 20) + 10;
        generatedNodes.push({
          url: `https://${domainInput}/${section}/page-${i}/`,
          title: `${section} Page ${i} - ${domainInput}`,
          incomingLinks: 1,
          outgoingLinks: Math.floor(Math.random() * 3),
          pageRank: subPageRank,
          level: 2
        });
        
        setProgress(Math.min(100, Math.round((generatedNodes.length / (sectionNames.length * 6)) * 100)));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    generatedNodes.sort((a, b) => b.pageRank - a.pageRank);
    setNodes(generatedNodes);
  };

  const prepareTreemapData = () => {
    const data = nodes.map(node => ({
      name: node.title,
      url: node.url,
      size: node.pageRank,
      level: node.level,
      incomingLinks: node.incomingLinks,
      outgoingLinks: node.outgoingLinks
    }));
    
    return [{
      name: 'Структура сайта',
      children: data
    }];
  };

  const filteredNodes = filter
    ? nodes.filter(node => 
        node.url.toLowerCase().includes(filter.toLowerCase()) || 
        node.title.toLowerCase().includes(filter.toLowerCase())
      )
    : nodes;

  const getLevelData = () => {
    const levelCounts: Record<number, number> = {};
    nodes.forEach(node => {
      if (!levelCounts[node.level]) {
        levelCounts[node.level] = 0;
      }
      levelCounts[node.level]++;
    });
    
    return Object.entries(levelCounts).map(([level, count]) => ({
      name: `Уровень ${level}`,
      value: count
    }));
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileTree className="h-5 w-5 text-primary" />
              <CardTitle>Визуализация структуры сайта</CardTitle>
            </div>
            {nodes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  toast({
                    title: "Экспорт структуры",
                    description: "Функция будет доступна в полной версии",
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Экспорт структуры
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <Input
                  type="text"
                  placeholder="Введите домен (например, example.com)"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={analyzeSiteStructure}
                disabled={isAnalyzing || !domainInput}
                className="gap-1"
              >
                {isAnalyzing ? 'Анализ...' : 'Визуализировать'}
                {!isAnalyzing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Анализ структуры сайта...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {nodes.length > 0 && (
              <div className="mt-6">
                <Tabs defaultValue="treemap">
                  <TabsList className="mb-4">
                    <TabsTrigger value="treemap" className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Карта структуры
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1">
                      <Network className="h-4 w-4" />
                      Таблица PageRank
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="treemap">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2">Структура сайта и PageRank</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Размер блоков соответствует значению PageRank страницы. Чем больше блок, тем выше значимость страницы.
                          </p>
                        </div>
                        
                        <div className="h-96 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                              data={prepareTreemapData()}
                              dataKey="size"
                              nameKey="name"
                              ratio={4/3}
                              stroke="#fff"
                              fill="#8884d8"
                            >
                              <RechartsTooltip 
                                formatter={(value, name, props) => {
                                  if (props?.payload?.url) {
                                    return [
                                      <div key="tooltip">
                                        <div><strong>URL:</strong> {props.payload.url}</div>
                                        <div><strong>PageRank:</strong> {props.payload.size}</div>
                                        <div><strong>Уровень:</strong> {props.payload.level}</div>
                                        <div><strong>Входящие ссылки:</strong> {props.payload.incomingLinks}</div>
                                        <div><strong>Исходящие ссылки:</strong> {props.payload.outgoingLinks}</div>
                                      </div>,
                                      props.payload.name
                                    ];
                                  }
                                  return [value, name];
                                }}
                                wrapperStyle={{ maxWidth: '300px' }}
                              />
                            </Treemap>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {getLevelData().map((item, index) => (
                            <Card key={index}>
                              <CardContent className="py-4">
                                <div className="text-center">
                                  <h4 className="text-sm font-medium">{item.name}</h4>
                                  <p className="text-2xl font-bold">{item.value}</p>
                                  <p className="text-xs text-muted-foreground">страниц</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="table">
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Фильтр по URL или заголовку..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Заголовок</TableHead>
                            <TableHead className="text-center">PageRank</TableHead>
                            <TableHead className="text-center">Уровень</TableHead>
                            <TableHead className="text-center">Вх. ссылки</TableHead>
                            <TableHead className="text-center">Исх. ссылки</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredNodes.length > 0 ? (
                            filteredNodes.map((node, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  <a 
                                    href={node.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="hover:underline text-primary"
                                  >
                                    {node.url}
                                  </a>
                                </TableCell>
                                <TableCell>{node.title}</TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    variant={node.pageRank > 70 ? "default" : node.pageRank > 30 ? "outline" : "secondary"}
                                  >
                                    {node.pageRank.toFixed(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">{node.level}</TableCell>
                                <TableCell className="text-center">{node.incomingLinks}</TableCell>
                                <TableCell className="text-center">{node.outgoingLinks}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6">
                                {filter 
                                  ? 'Нет результатов по вашему фильтру' 
                                  : 'Нет данных о структуре сайта'
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!isAnalyzing && nodes.length === 0 && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileTree className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-muted-foreground mb-4">
                    Введите домен и запустите анализ, чтобы визуализировать структуру сайта и рассчитать внутренний PageRank
                  </p>
                  <Button 
                    variant="default" 
                    onClick={analyzeSiteStructure}
                    disabled={!domainInput}
                  >
                    Запустить анализ
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
