
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditContext } from '@/contexts/AuditContext';
import AuditOverview from './AuditOverview';
import AuditIssues from './AuditIssues';
import OptimizationSection from './OptimizationSection';
import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface SiteAuditContentProps {
  url: string;
}

// Демо-данные для отображения при недоступности реального API
import demoAuditData from '@/data/demo-audit.json';

const SiteAuditContent: React.FC<SiteAuditContentProps> = ({ url }) => {
  const { auditData, isLoading, error, fetchAuditData } = useAuditContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showOptimization, setShowOptimization] = useState(false);
  
  console.log("SiteAuditContent rendering with URL:", url);
  console.log("Current audit data:", auditData);
  
  useEffect(() => {
    const loadAuditData = async () => {
      try {
        await fetchAuditData(url);
      } catch (error) {
        console.error("Failed to fetch audit data:", error);
      }
    };
    
    if (url) {
      loadAuditData();
    }
  }, [url, fetchAuditData]);
  
  const handleOrderOptimization = () => {
    setShowOptimization(true);
    setActiveTab("optimization");
    toast({
      title: "Переход к оптимизации",
      description: "Вы можете просмотреть детали и заказать оптимизацию",
    });
  };
  
  const data = auditData || demoAuditData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <Skeleton className="h-4 w-4/6 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка загрузки данных аудита</AlertTitle>
        <AlertDescription className="mt-2">
          {error.toString()}
          <div className="mt-4">
            <Button onClick={() => fetchAuditData(url)}>
              Попробовать снова
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="issues">Проблемы и рекомендации</TabsTrigger>
          <TabsTrigger value="optimization">Оптимизация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <AuditOverview auditData={data} />
          
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button 
              onClick={handleOrderOptimization} 
              size="lg" 
              className="group"
            >
              Заказать оптимизацию сайта
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="issues">
          <AuditIssues auditData={data} />
        </TabsContent>
        
        <TabsContent value="optimization">
          <OptimizationSection url={url} auditData={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteAuditContent;
