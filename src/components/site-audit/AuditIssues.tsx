
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface AuditIssue {
  id: string;
  title: string;
  description: string;
  impact?: string;
}

interface AuditIssuesProps {
  auditData: any;
}

const AuditIssues: React.FC<AuditIssuesProps> = ({ auditData }) => {
  const [activeIssueTab, setActiveIssueTab] = useState('critical');
  
  const criticalIssues = auditData.issues?.critical || [];
  const importantIssues = auditData.issues?.important || [];
  const opportunities = auditData.issues?.opportunities || [];
  const minorIssues = auditData.issues?.minor || [];
  const passedChecks = auditData.issues?.passed || [];
  
  const getIssueColor = (impact: string | undefined) => {
    switch(impact) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      case 'low': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-green-500 bg-green-50';
    }
  };
  
  const getIssueTextColor = (impact: string | undefined) => {
    switch(impact) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-orange-700';
      case 'low': return 'text-yellow-700';
      case 'info': return 'text-blue-700';
      default: return 'text-green-700';
    }
  };
  
  const renderIssueItems = (items: AuditIssue[]) => {
    return (
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Нет проблем в этой категории</p>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-l-4 rounded-md ${getIssueColor(item.impact)}`}
            >
              <h3 className={`text-lg font-medium mb-1 ${getIssueTextColor(item.impact)}`}>
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle>Проблемы и рекомендации</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeIssueTab} onValueChange={setActiveIssueTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="critical" className="data-[state=active]:text-red-600">
              Критические ({criticalIssues.length})
            </TabsTrigger>
            <TabsTrigger value="important" className="data-[state=active]:text-orange-600">
              Важные ({importantIssues.length})
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:text-yellow-600">
              Возможности ({opportunities.length})
            </TabsTrigger>
            <TabsTrigger value="minor" className="data-[state=active]:text-blue-600">
              Незначительные ({minorIssues.length})
            </TabsTrigger>
            <TabsTrigger value="passed" className="data-[state=active]:text-green-600">
              Успешные ({passedChecks.length})
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
          
          <TabsContent value="minor" className="mt-0">
            {renderIssueItems(minorIssues)}
          </TabsContent>
          
          <TabsContent value="passed" className="mt-0">
            {renderIssueItems(passedChecks)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditIssues;
