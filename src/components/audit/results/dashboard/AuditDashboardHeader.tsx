import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Download, Share2, Clock, Globe, AlertCircle } from 'lucide-react';
import { DashboardMetrics } from './types';

interface AuditDashboardHeaderProps {
  metrics: DashboardMetrics;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
}

const AuditDashboardHeader: React.FC<AuditDashboardHeaderProps> = ({
  metrics,
  onExportPDF,
  onExportJSON,
  onShare
}) => {
  const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setCount(Math.floor(progress * value));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <span>{count}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Score Display */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(metrics.totalScore)}`}>
                  <AnimatedCounter value={metrics.totalScore} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">Общий Score</div>
              </div>

              <div className="h-16 w-px bg-border" />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Страниц</div>
                    <div className="font-bold text-lg">
                      <AnimatedCounter value={metrics.totalPages} duration={1500} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Проблем</div>
                    <div className="font-bold text-lg">
                      <AnimatedCounter value={metrics.totalIssues} duration={1500} />
                    </div>
                  </div>
                </div>

                {metrics.scanDuration && (
                  <div className="flex items-center gap-2 col-span-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Время аудита</div>
                      <div className="font-bold">{metrics.scanDuration}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-sm">
                  {metrics.criticalIssues} критических
                </Badge>
                <Badge className="text-sm bg-warning/20 text-warning hover:bg-warning/30 border-warning/30">
                  {metrics.warningIssues} предупреждений
                </Badge>
                <Badge className="text-sm bg-success/20 text-success hover:bg-success/30 border-success/30">
                  {metrics.passedChecks} пройдено
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Экспорт
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExportPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Скачать PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportJSON}>
                    <FileText className="mr-2 h-4 w-4" />
                    Экспорт JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditDashboardHeader;
