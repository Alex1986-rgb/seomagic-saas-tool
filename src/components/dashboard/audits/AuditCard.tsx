
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { auditPagePath } from '@/modules/audit/utils/auditLinks';

interface AuditProps {
  audit: {
    id: string;
    url: string;
    score: number | null;
    date: string;
    status: string;
    /** Задача аудита (`audit_tasks.id`): по ней открывается именно эта проверка. */
    taskId?: string | null;
  };
}

export const AuditCard: React.FC<AuditProps> = ({ audit }) => (
  <Card className="bg-card/90 backdrop-blur-sm border-border p-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-medium mb-1">{audit.url}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span className="mr-4">
            {new Date(audit.date).toLocaleDateString()}
          </span>
          <Clock size={14} className="mr-1" />
          <span>
            {new Date(audit.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0">
        {audit.status === 'processing' ? (
          <div className="flex items-center text-primary">
            <RefreshCw size={18} className="mr-2 animate-spin" />
            <span>Обработка...</span>
          </div>
        ) : (
          <>
            <div className="mr-6">
              <div className="text-sm text-muted-foreground mb-1">SEO оценка</div>
              <div className={`text-xl font-semibold ${
                audit.score >= 80 ? 'text-green-500' : 
                audit.score >= 60 ? 'text-amber-500' : 'text-destructive'
              }`}>
                {audit.score ?? '—'}/100
              </div>
            </div>
            
            {/*
              Раньше: <a href="/audit?url=..."> — без номера задачи (открывалась
              «последняя проверка по домену») и мимо адреса сборки: на подпути
              /seomagic-saas-tool/ ссылка вела в 404.
            */}
            <Link 
              to={auditPagePath(audit.url, audit.taskId)} 
              className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              Смотреть детали
            </Link>
          </>
        )}
      </div>
    </div>
  </Card>
);
