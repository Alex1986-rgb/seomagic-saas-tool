
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, TrendingUp, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SeoElement {
  title: string;
  description: string;
  score: number;
  improvements: string[];
  before: string;
  after: string;
  type: 'title' | 'description' | 'keywords' | 'heading';
}

interface SeoElementsCardProps {
  elements: SeoElement[];
  onOptimize?: () => void;
}

const SeoElementsCard: React.FC<SeoElementsCardProps> = ({ elements, onOptimize }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Оптимизированный текст скопирован в буфер обмена",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'title':
        return <Search className="h-4 w-4" />;
      case 'description':
        return <Eye className="h-4 w-4" />;
      case 'keywords':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(element.type)}
                  <CardTitle className="text-lg">{element.title}</CardTitle>
                </div>
                <Badge 
                  variant={element.score >= 90 ? "default" : element.score >= 70 ? "secondary" : "destructive"}
                  className={getScoreColor(element.score)}
                >
                  {element.score}/100
                </Badge>
              </div>
              <CardDescription>{element.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Before/After comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">До оптимизации:</div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm">
                    {element.before}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-green-700 dark:text-green-400">
                      После оптимизации:
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(element.after)}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-sm">
                    {element.after}
                  </div>
                </div>
              </div>
              
              {/* Improvements */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Улучшения:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {element.improvements.map((improvement, improvementIndex) => (
                    <div 
                      key={improvementIndex}
                      className="flex items-center gap-2 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {onOptimize && (
        <div className="flex justify-center mt-6">
          <Button onClick={onOptimize} size="lg">
            Оптимизировать еще элементы
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeoElementsCard;
