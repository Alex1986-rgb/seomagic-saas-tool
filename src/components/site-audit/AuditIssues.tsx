
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, AlertCircle, Info, Lightbulb, FileText, Image, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditIssue {
  id: string;
  title: string;
  description: string;
  impact?: string;
  category?: string;
}

interface AuditIssuesProps {
  auditData: any;
}

const AuditIssues: React.FC<AuditIssuesProps> = ({ auditData }) => {
  const [activeIssueTab, setActiveIssueTab] = useState('critical');
  
  // Получаем количество проблем для каждой категории
  const getIssueCount = (issues: any): number => {
    if (Array.isArray(issues)) return issues.length;
    if (typeof issues === 'number') return issues;
    return 0;
  };
  
  const criticalIssues = auditData.issues?.critical || [];
  const importantIssues = auditData.issues?.important || [];
  const opportunities = auditData.issues?.opportunities || [];
  const metaIssues = auditData.issues?.meta || [];
  const contentIssues = auditData.issues?.content || [];
  const linkIssues = auditData.issues?.links || [];
  const imageIssues = auditData.issues?.images || [];
  const minorIssues = auditData.issues?.minor || 0;
  const passedChecks = auditData.issues?.passed || 0;
  
  const criticalCount = getIssueCount(criticalIssues);
  const importantCount = getIssueCount(importantIssues);
  const opportunitiesCount = getIssueCount(opportunities);
  const metaCount = getIssueCount(metaIssues);
  const contentCount = getIssueCount(contentIssues);
  const linkCount = getIssueCount(linkIssues);
  const imageCount = getIssueCount(imageIssues);
  
  const getIssueColor = (impact: string | undefined) => {
    switch(impact) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };
  
  const getIssueTextColor = (impact: string | undefined) => {
    switch(impact) {
      case 'high': return 'text-red-700 dark:text-red-400';
      case 'medium': return 'text-orange-700 dark:text-orange-400';
      case 'low': return 'text-yellow-700 dark:text-yellow-400';
      case 'info': return 'text-blue-700 dark:text-blue-400';
      default: return 'text-green-700 dark:text-green-400';
    }
  };

  const getIssueIcon = (impact: string | undefined, category?: string) => {
    // First check if we should use category-specific icon
    if (category) {
      if (category === 'meta' || category === 'meta-tags') 
        return <FileText className="h-5 w-5 text-blue-600" />;
      if (category === 'images' || category === 'image') 
        return <Image className="h-5 w-5 text-purple-600" />;
      if (category === 'links' || category === 'link') 
        return <Link className="h-5 w-5 text-pink-600" />;
    }
    
    // Fallback to impact-based icons
    switch(impact) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'low': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };
  
  const renderIssueItems = (items: AuditIssue[]) => {
    return (
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
            <Info className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">Нет проблем в этой категории</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-l-4 rounded-md shadow-sm ${getIssueColor(item.impact)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIssueIcon(item.impact, item.category)}
                </div>
                <div className="flex-grow">
                  <h3 className={`text-lg font-medium mb-1 ${getIssueTextColor(item.impact)}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  {item.impact && (
                    <div className="mt-2">
                      <Badge variant={
                        item.impact === 'high' ? 'destructive' : 
                        item.impact === 'medium' ? 'default' :
                        item.impact === 'low' ? 'outline' : 'secondary'
                      } className="mt-1">
                        {item.impact === 'high' ? 'Срочно исправить' : 
                         item.impact === 'medium' ? 'Важно' :
                         item.impact === 'low' ? 'Рекомендация' : 'Информация'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between">
          <span>Проблемы и рекомендации</span>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-red-500">{criticalCount} крит.</span>
            <span className="text-amber-500">{importantCount} важн.</span>
            <span className="text-yellow-500">{opportunitiesCount} возм.</span>
            <span className="text-blue-500">{metaCount} мета</span>
            <span className="text-purple-500">{imageCount} изобр.</span>
            <span className="text-pink-500">{linkCount} ссыл.</span>
            <span className="text-teal-500">{contentCount} конт.</span>
            <span className="text-gray-500">{minorIssues} мин.</span>
            <span className="text-green-500">{passedChecks} проп.</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeIssueTab} onValueChange={setActiveIssueTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 mb-6">
            <TabsTrigger value="critical" className="data-[state=active]:text-red-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Критические</span> ({criticalCount})
            </TabsTrigger>
            <TabsTrigger value="important" className="data-[state=active]:text-orange-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Важные</span> ({importantCount})
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:text-yellow-600">
              <Lightbulb className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Возможности</span> ({opportunitiesCount})
            </TabsTrigger>
            <TabsTrigger value="meta" className="data-[state=active]:text-blue-600">
              <FileText className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Мета-теги</span> ({metaCount})
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:text-teal-600">
              <Info className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Контент</span> ({contentCount})
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:text-purple-600">
              <Image className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Изображения</span> ({imageCount})
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:text-pink-600">
              <Link className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Ссылки</span> ({linkCount})
            </TabsTrigger>
            <TabsTrigger value="minor" className="data-[state=active]:text-blue-600">
              <Info className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Незначит.</span> ({minorIssues})
            </TabsTrigger>
            <TabsTrigger value="passed" className="data-[state=active]:text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Успешные</span> ({passedChecks})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="critical" className="mt-0">
            {renderIssueItems(criticalIssues)}
          </TabsContent>
          
          <TabsContent value="important" className="mt-0">
            {renderIssueItems(importantIssues)}
          </TabsContent>
          
          <TabsContent value="opportunities" className="mt-0">
            {renderIssueItems(opportunities)}
          </TabsContent>
          
          <TabsContent value="meta" className="mt-0">
            {renderIssueItems(metaIssues)}
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            {renderIssueItems(contentIssues)}
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            {renderIssueItems(imageIssues)}
          </TabsContent>
          
          <TabsContent value="links" className="mt-0">
            {renderIssueItems(linkIssues)}
          </TabsContent>
          
          <TabsContent value="minor" className="mt-0">
            <div className="text-center py-12 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
              <Info className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">Обнаружено {minorIssues} незначительных проблем</p>
            </div>
          </TabsContent>
          
          <TabsContent value="passed" className="mt-0">
            <div className="text-center py-12 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 opacity-70 mb-2" />
              <p className="text-muted-foreground">Успешно пройдено {passedChecks} проверок</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditIssues;
