
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditContext } from '@/contexts/AuditContext';
import AuditOverview from './AuditOverview';
import AuditIssues from './AuditIssues';
import OptimizationSection from './OptimizationSection';
import OptimizationSummary from './OptimizationSummary';
import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

// Import the generator functions directly
import { generateMockOptimizationItems, calculateTotalCost } from '@/services/audit/generators';

interface SiteAuditContentProps {
  url: string;
}

// Демо-данные для отображения при недоступности реального API
import demoAuditData from '@/data/demo-audit.json';

const SiteAuditContent: React.FC<SiteAuditContentProps> = ({ url }) => {
  const { auditData, isLoading, error, loadAuditData } = useAuditContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showOptimization, setShowOptimization] = useState(false);
  
  console.log("SiteAuditContent rendering with URL:", url);
  console.log("Current audit data:", auditData);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadAuditData(false);
      } catch (error) {
        console.error("Failed to fetch audit data:", error);
      }
    };
    
    if (url) {
      loadData();
    }
  }, [url, loadAuditData]);
  
  const handleOrderOptimization = () => {
    setShowOptimization(true);
    setActiveTab("optimization");
    toast({
      title: "Переход к оптимизации",
      description: "Вы можете просмотреть детали и заказать оптимизацию",
    });
  };
  
  // Make sure we have a valid data object, not an HTML string or other unexpected type
  let data: AuditData | null = null;
  
  // Check if auditData is not of expected type or is a string (which might be HTML)
  if (!auditData || typeof auditData === 'string' || !Object.prototype.hasOwnProperty.call(auditData, 'pageCount')) {
    console.warn("Using demo data because audit data is invalid:", typeof auditData);
    try {
      // Use demo data as fallback with deep clone to avoid modifying the original
      const processedData = JSON.parse(JSON.stringify(demoAuditData));
    
      // Ensure status is one of the allowed values
      if (processedData.status && typeof processedData.status === 'string' && 
          !['completed', 'failed', 'in-progress'].includes(processedData.status)) {
        processedData.status = 'completed'; // Set to a default allowed value
      }
      
      // Ensure issues are properly formatted
      if (processedData.issues) {
        // Convert any issue objects to strings to prevent rendering errors
        ['critical', 'important', 'opportunities', 'minor', 'passed'].forEach(category => {
          if (processedData.issues[category]) {
            if (Array.isArray(processedData.issues[category])) {
              // Map objects to strings to avoid direct rendering
              processedData.issues[category] = processedData.issues[category].map((item: any) => {
                if (typeof item === 'object') {
                  return JSON.stringify(item);
                }
                return item;
              });
            } else if (typeof processedData.issues[category] === 'object') {
              processedData.issues[category] = [JSON.stringify(processedData.issues[category])];
            }
          }
        });
      }
      
      // Use explicit type assertion through unknown for safety
      data = processedData as unknown as AuditData;
    } catch (err) {
      console.error("Error processing demo data:", err);
      data = null;
    }
  } else {
    try {
      // If we have valid audit data, create a deep copy to avoid modifying the original
      const processedData = JSON.parse(JSON.stringify(auditData));
      
      // Ensure status is one of the allowed values
      if (processedData.status && typeof processedData.status === 'string' && 
          !['completed', 'failed', 'in-progress'].includes(processedData.status)) {
        processedData.status = 'completed'; // Set to a default allowed value
      }
      
      // Ensure issues are properly formatted
      if (processedData.issues) {
        // Convert any issue objects to strings to prevent rendering errors
        ['critical', 'important', 'opportunities', 'minor', 'passed'].forEach(category => {
          if (processedData.issues[category]) {
            if (Array.isArray(processedData.issues[category])) {
              // Map objects to strings to avoid direct rendering
              processedData.issues[category] = processedData.issues[category].map((item: any) => {
                if (typeof item === 'object') {
                  return JSON.stringify(item);
                }
                return item;
              });
            } else if (typeof processedData.issues[category] === 'object') {
              processedData.issues[category] = [JSON.stringify(processedData.issues[category])];
            }
          }
        });
      }
      
      // Use explicit type assertion through unknown for safety
      data = processedData as unknown as AuditData;
    } catch (err) {
      console.error("Error processing audit data:", err);
      data = null;
    }
  }
  
  // Make sure we have optimization data for demo purposes
  if (data && !data.optimizationItems) {
    try {
      const pageCount = data.pageCount || 20;
      const optimizationItems = generateMockOptimizationItems(pageCount);
      // Use type assertion to make TypeScript happy
      data.optimizationItems = optimizationItems as any;
      data.optimizationCost = calculateTotalCost(optimizationItems);
    } catch (err) {
      console.error("Failed to generate mock optimization data:", err);
      // Provide fallback empty arrays to avoid further errors
      data.optimizationItems = [];
      data.optimizationCost = 0;
    }
  }

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
            <Button onClick={() => loadAuditData(true)}>
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
          {data && <AuditOverview auditData={data} />}
          
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
          {data && <AuditIssues auditData={data} />}
        </TabsContent>
        
        <TabsContent value="optimization">
          {data && (
            <>
              <OptimizationSection 
                url={url} 
                auditData={data} 
              />
              <div className="mt-8">
                <OptimizationSummary auditData={data} />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteAuditContent;
