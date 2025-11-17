import { motion } from 'framer-motion';
import { Play, Search, BarChart3, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FlowParticle } from './FlowParticle';
import { FlowNode } from './types';
import { Progress } from '@/components/ui/progress';

interface AuditFlowDiagramProps {
  currentStage: string;
  progress: number;
  nodes: FlowNode[];
}

export const AuditFlowDiagram = ({ currentStage, progress, nodes }: AuditFlowDiagramProps) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'Play': Play,
      'Search': Search,
      'BarChart3': BarChart3,
      'CheckCircle': CheckCircle,
    };
    return icons[iconName] || Play;
  };

  const getNodeColor = (status: FlowNode['status']) => {
    switch (status) {
      case 'active':
        return 'border-primary bg-primary/10 shadow-lg shadow-primary/20';
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'error':
        return 'border-destructive bg-destructive/10';
      default:
        return 'border-border bg-muted';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          {nodes.map((node, index) => {
            const Icon = getIcon(node.icon);
            const isActive = node.status === 'active';
            const showArrow = index < nodes.length - 1;

            return (
              <div key={node.id} className="flex items-center flex-1">
                {/* Node */}
                <motion.div
                  animate={isActive ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.7)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`
                    relative rounded-xl border-2 p-6 w-full
                    ${getNodeColor(node.status)}
                    transition-all duration-300
                  `}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`
                      p-3 rounded-full
                      ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center w-full">
                      <p className={`
                        text-sm font-semibold mb-1
                        ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                      `}>
                        {node.label}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {node.progress}%
                      </p>
                      <Progress value={node.progress} className="h-1" />
                    </div>
                    
                    {/* Metrics */}
                    {node.metrics && node.metrics.length > 0 && (
                      <div className="mt-2 space-y-1 w-full">
                        {node.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{metric.label}</span>
                            <span className="font-medium text-foreground">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Arrow with particles */}
                {showArrow && (
                  <div className="relative mx-2 flex-shrink-0" style={{ width: '100px', height: '2px' }}>
                    <div className="absolute inset-0 bg-border" />
                    {isActive && (
                      <>
                        <FlowParticle delay={0} />
                        <FlowParticle delay={0.5} />
                        <FlowParticle delay={1} />
                      </>
                    )}
                    {/* Arrow head */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-border" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
