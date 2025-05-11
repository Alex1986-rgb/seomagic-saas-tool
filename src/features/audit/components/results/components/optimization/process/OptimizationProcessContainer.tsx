
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { OptimizationProcessContainerProps } from '@/features/audit/types/optimization-types';

export const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({ 
  url = '', 
  progress = 0, 
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const [currentStep, setCurrentStep] = useState("Подготовка к оптимизации...");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Update current step based on progress
    if (progress < 20) {
      setCurrentStep("Подготовка к оптимизации...");
    } else if (progress < 40) {
      setCurrentStep("Оптимизация мета-тегов...");
    } else if (progress < 60) {
      setCurrentStep("Оптимизация контента...");
    } else if (progress < 80) {
      setCurrentStep("Оптимизация структуры...");
    } else if (progress < 100) {
      setCurrentStep("Финальные улучшения...");
    } else {
      setCurrentStep("Оптимизация завершена!");
      setIsComplete(true);
      
      // When complete, set the result and update optimization status
      if (setOptimizationResult && !isComplete) {
        setTimeout(() => {
          // Sample result data
          setOptimizationResult({
            beforeScore: 65,
            afterScore: 92,
          });
          
          if (setLocalIsOptimized) {
            setLocalIsOptimized(true);
          }
        }, 1000);
      }
    }
  }, [progress, isComplete, setOptimizationResult, setLocalIsOptimized]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <RefreshCcw className="h-5 w-5 mr-2 animate-spin" />
          )}
          Процесс оптимизации
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{currentStep}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="pt-4">
            {isComplete ? (
              <div className="flex items-center justify-center text-green-600 font-medium">
                <CheckCircle className="h-5 w-5 mr-2" />
                Оптимизация успешно завершена!
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>Оптимизируем сайт: <span className="font-medium">{url}</span></p>
                <div className="flex items-center mt-2">
                  <span>Выполняется:</span>
                  <ArrowRight className="h-4 w-4 mx-2" />
                  <span className="font-medium">{currentStep}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
