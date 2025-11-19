
import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Lightbulb, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { AuditData, AuditIssue } from '@/types/audit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AuditIssuesAndEstimateProps {
  auditData: AuditData;
  optimizationCost: number;
  optimizationItems: any[]; 
  onApproveEstimate?: () => void;
}

export const AuditIssuesAndEstimate: React.FC<AuditIssuesAndEstimateProps> = ({ 
  auditData, 
  optimizationCost,
  optimizationItems,
  onApproveEstimate 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Helper function to normalize issues
  const normalizeIssues = (issues: any[]): AuditIssue[] => {
    if (!Array.isArray(issues)) return [];
    
    return issues.map((issue, index) => {
      if (typeof issue === 'string') {
        try {
          // Try to parse if it's a stringified JSON
          const parsed = JSON.parse(issue);
          if (typeof parsed === 'object' && parsed !== null) {
            return {
              id: parsed.id || `issue-${index}`,
              title: parsed.title || issue,
              description: parsed.description || '',
              impact: parsed.impact || 'medium'
            };
          }
        } catch (e) {
          // Not a JSON string, use as is
        }
        
        // Create a simple object from the string
        return {
          id: `issue-${index}`,
          title: issue,
          description: '',
          impact: 'medium'
        };
      } else if (typeof issue === 'object' && issue !== null) {
        // Already an object, ensure it has the required fields
        return {
          id: issue.id || `issue-${index}`,
          title: issue.title || 'Unknown Issue',
          description: issue.description || '',
          impact: issue.impact || 'medium'
        };
      }
      
      // Fallback for any other type
      return {
        id: `issue-${index}`,
        title: String(issue),
        description: '',
        impact: 'medium'
      };
    });
  };

  const criticalIssues = normalizeIssues(auditData.issues?.critical || []);
  const importantIssues = normalizeIssues(auditData.issues?.important || []);
  const opportunities = normalizeIssues(auditData.issues?.opportunities || []);

  const totalIssues = criticalIssues.length + importantIssues.length + opportunities.length;
  
  // Show loading state if no data
  if (totalIssues === 0 && !optimizationCost) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Детализация проблем и смета</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Расчёт стоимости оптимизации...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate individual prices based on severity
  const getPricePerIssue = (type: 'critical' | 'important' | 'opportunity') => {
    switch(type) {
      case 'critical':
        return 2500; // Higher price for critical issues
      case 'important':
        return 1500; // Medium price for important issues
      case 'opportunity':
        return 800; // Lower price for opportunities
      default:
        return 1000;
    }
  };
  
  const criticalTotalPrice = criticalIssues.length * getPricePerIssue('critical');
  const importantTotalPrice = importantIssues.length * getPricePerIssue('important');
  const opportunitiesTotalPrice = opportunities.length * getPricePerIssue('opportunity');
  
  // Calculate total cost with volume discount
  const calculateTotalWithDiscount = () => {
    const baseTotal = criticalTotalPrice + importantTotalPrice + opportunitiesTotalPrice;
    
    // Apply volume discount based on total issues
    let discountPercent = 0;
    if (totalIssues > 20) {
      discountPercent = 25;
    } else if (totalIssues > 10) {
      discountPercent = 15;
    } else if (totalIssues > 5) {
      discountPercent = 10;
    }
    
    const discountAmount = Math.round(baseTotal * (discountPercent / 100));
    const finalTotal = baseTotal - discountAmount;
    
    return {
      baseTotal,
      discountPercent,
      discountAmount,
      finalTotal
    };
  };
  
  const costCalculation = calculateTotalWithDiscount();

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(cost);
  };

  const renderIssueWithPrice = (issue: AuditIssue, index: number, type: 'critical' | 'important' | 'opportunity') => {
    const price = getPricePerIssue(type);
    
    return (
      <li key={`${type}-${index}`} className="flex justify-between items-center">
        <span>{issue.title}</span>
        <span className="text-sm font-medium text-primary">{formatCost(price)}</span>
      </li>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Основные проблемы
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs ml-2">
              {totalIssues} шт.
            </span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 px-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>Скрыть детали <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Показать детали <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Критические ошибки <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-xs ml-2">{criticalIssues.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {criticalIssues.map((issue, index) => (
                showDetails 
                  ? renderIssueWithPrice(issue, index, 'critical')
                  : <li key={`critical-${index}`}>{issue.title}</li>
              ))}
            </ul>
            {showDetails && criticalIssues.length > 0 && (
              <div className="flex justify-between text-sm font-medium pt-1">
                <span>Всего критических ошибок:</span>
                <span className="text-primary">{formatCost(criticalTotalPrice)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Важные исправления <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-xs ml-2">{importantIssues.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {importantIssues.map((issue, index) => (
                showDetails 
                  ? renderIssueWithPrice(issue, index, 'important')
                  : <li key={`important-${index}`}>{issue.title}</li>
              ))}
            </ul>
            {showDetails && importantIssues.length > 0 && (
              <div className="flex justify-between text-sm font-medium pt-1">
                <span>Всего важных исправлений:</span>
                <span className="text-primary">{formatCost(importantTotalPrice)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-500" />
              Возможности <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs ml-2">{opportunities.length}</span>
            </h3>
            <ul className="space-y-1 text-sm">
              {opportunities.map((issue, index) => (
                showDetails 
                  ? renderIssueWithPrice(issue, index, 'opportunity')
                  : <li key={`opportunity-${index}`}>{issue.title}</li>
              ))}
            </ul>
            {showDetails && opportunities.length > 0 && (
              <div className="flex justify-between text-sm font-medium pt-1">
                <span>Всего возможностей:</span>
                <span className="text-primary">{formatCost(opportunitiesTotalPrice)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Расчет оптимизации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {showDetails ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Базовая стоимость исправлений</span>
                  <span className="font-medium">{formatCost(costCalculation.baseTotal)}</span>
                </div>
                
                {costCalculation.discountPercent > 0 && (
                  <div className="flex justify-between items-center border-b pb-2 text-green-600">
                    <span>Скидка за объем ({costCalculation.discountPercent}%)</span>
                    <span className="font-medium">-{formatCost(costCalculation.discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Оптимизация контента ({auditData.pageCount || 0} стр.)</span>
                  <span className="font-medium">{formatCost(optimizationCost)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Итоговая стоимость</span>
                  <span className="text-lg font-bold text-primary">{formatCost(costCalculation.finalTotal + optimizationCost)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-lg font-semibold mb-1">Стоимость оптимизации</p>
                <p className="text-2xl font-bold text-primary">{formatCost(costCalculation.finalTotal + optimizationCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">Нажмите "Показать детали" для просмотра расчета</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Что входит:</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Исправление всех критических ошибок</li>
                <li>✓ Оптимизация мета-тегов</li>
                <li>✓ Улучшение структуры контента</li>
                <li>✓ Оптимизация {auditData.pageCount || 0} страниц</li>
                <li>✓ Полный HTML-экспорт исправленного сайта</li>
              </ul>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={onApproveEstimate}
                    className="w-full mt-2 gap-2"
                  >
                    <Check className="h-4 w-4" /> Согласен, начать оптимизацию
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Нажмите, чтобы перейти к оплате и оптимизации</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditIssuesAndEstimate;
