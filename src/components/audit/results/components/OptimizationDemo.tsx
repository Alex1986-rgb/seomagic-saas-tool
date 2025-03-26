
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';

interface OptimizationDemoProps {
  beforeTitle: string;
  afterTitle: string;
  beforeContent: string;
  afterContent: string;
  beforeMeta?: {
    description?: string;
    keywords?: string;
  };
  afterMeta?: {
    description?: string;
    keywords?: string;
  };
  beforeScore: number;
  afterScore: number;
  className?: string;
}

const OptimizationDemo: React.FC<OptimizationDemoProps> = ({
  beforeTitle,
  afterTitle,
  beforeContent,
  afterContent,
  beforeMeta,
  afterMeta,
  beforeScore,
  afterScore,
  className
}) => {
  return (
    <motion.div 
      className={`bg-card border border-border rounded-lg p-4 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-medium mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-primary" />
        Демонстрация оптимизации
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-4 bg-muted/30 relative">
          <div className="absolute top-2 right-2 rounded-full bg-amber-500/20 text-amber-500 px-2 py-1 text-xs font-medium flex items-center">
            <span>Оценка: {beforeScore}</span>
          </div>
          <h4 className="text-lg font-medium mb-2">До оптимизации</h4>
          
          <div className="space-y-3">
            <div className="bg-muted rounded p-2">
              <div className="text-sm font-semibold text-muted-foreground mb-1">Заголовок:</div>
              <div>{beforeTitle}</div>
            </div>
            
            {beforeMeta?.description && (
              <div className="bg-muted rounded p-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Meta Description:</div>
                <div className="text-sm">{beforeMeta.description}</div>
              </div>
            )}
            
            {beforeMeta?.keywords && (
              <div className="bg-muted rounded p-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Meta Keywords:</div>
                <div className="text-sm">{beforeMeta.keywords}</div>
              </div>
            )}
            
            <div className="bg-muted rounded p-2">
              <div className="text-sm font-semibold text-muted-foreground mb-1">Контент:</div>
              <div className="text-sm max-h-60 overflow-y-auto">
                {beforeContent.split('\n\n').map((para, idx) => (
                  <p key={idx} className="mb-2">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg p-4 bg-muted/30 relative">
          <div className="absolute top-2 right-2 rounded-full bg-green-500/20 text-green-500 px-2 py-1 text-xs font-medium flex items-center">
            <span>Оценка: {afterScore}</span>
          </div>
          <h4 className="text-lg font-medium mb-2">После оптимизации</h4>
          
          <div className="space-y-3">
            <div className="bg-muted rounded p-2">
              <div className="text-sm font-semibold text-muted-foreground mb-1">Заголовок:</div>
              <div>{afterTitle}</div>
            </div>
            
            {afterMeta?.description && (
              <div className="bg-muted rounded p-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Meta Description:</div>
                <div className="text-sm">{afterMeta.description}</div>
              </div>
            )}
            
            {afterMeta?.keywords && (
              <div className="bg-muted rounded p-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Meta Keywords:</div>
                <div className="text-sm">{afterMeta.keywords}</div>
              </div>
            )}
            
            <div className="bg-muted rounded p-2">
              <div className="text-sm font-semibold text-muted-foreground mb-1">Контент:</div>
              <div className="text-sm max-h-60 overflow-y-auto" dangerouslySetInnerHTML={{ __html: afterContent.replace(/\n\n/g, '<br/><br/>') }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 px-3 bg-amber-500/20 text-amber-500 rounded-full">
            До: {beforeScore}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="p-2 px-3 bg-green-500/20 text-green-500 rounded-full">
            После: {afterScore}
          </div>
          <div className="p-2 px-3 bg-primary/20 text-primary rounded-full">
            Улучшение: +{afterScore - beforeScore} баллов
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Оптимизация значительно улучшила SEO-показатели страницы
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizationDemo;
