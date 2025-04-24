
import React from 'react';
import { Search, Calendar, Link, ExternalLink, Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditCardProps {
  audit: {
    id: string;
    url: string;
    score: number | null;
    date: string;
    status: string;
    issues?: {
      critical: number;
      important: number;
      opportunities: number;
    };
    optimized?: boolean;
  };
}

export const AuditCard: React.FC<AuditCardProps> = ({ audit }) => {
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="neo-card p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <a 
              href={audit.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {audit.url}
            </a>
            {audit.optimized && (
              <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
                Оптимизирован
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(audit.date).toLocaleString('ru-RU')}
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          {audit.status === 'processing' ? (
            <div className="flex items-center text-primary">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin mr-2"></div>
              <span>Обрабатывается...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">SEO оценка</div>
                <div className={`text-xl font-semibold ${getScoreColor(audit.score)}`}>
                  {audit.score}/100
                </div>
              </div>
              
              {audit.issues && (
                <IssuesIndicators issues={audit.issues} />
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/audit?url=${encodeURIComponent(audit.url)}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Детали
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface IssuesIndicatorsProps {
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
}

const IssuesIndicators: React.FC<IssuesIndicatorsProps> = ({ issues }) => (
  <div className="flex gap-2">
    <div className="text-center px-2 py-1 rounded bg-red-500/10">
      <div className="text-xs text-muted-foreground">Критические</div>
      <div className="font-semibold">{issues.critical}</div>
    </div>
    <div className="text-center px-2 py-1 rounded bg-amber-500/10">
      <div className="text-xs text-muted-foreground">Важные</div>
      <div className="font-semibold">{issues.important}</div>
    </div>
    <div className="text-center px-2 py-1 rounded bg-green-500/10">
      <div className="text-xs text-muted-foreground">Возможности</div>
      <div className="font-semibold">{issues.opportunities}</div>
    </div>
  </div>
);

