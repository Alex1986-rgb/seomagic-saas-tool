
import React from 'react';
import { Button } from "@/components/ui/button";

interface SiteCardProps {
  url: string;
  lastOptimized: string;
  score: number;
}

export const SiteCard: React.FC<SiteCardProps> = ({ url, lastOptimized, score }) => (
  <div className="neo-card p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-medium">{url}</h3>
        <p className="text-sm text-muted-foreground">
          Последняя оптимизация: {new Date(lastOptimized).toLocaleDateString()}
        </p>
      </div>
      <div className={`text-xl font-semibold ${
        score >= 80 ? 'text-green-500' : 
        score >= 60 ? 'text-amber-500' : 'text-destructive'
      }`}>
        {score}/100
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        Аналитика
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`/audit?url=${encodeURIComponent(url)}`}>
          Оптимизировать
        </a>
      </Button>
    </div>
  </div>
);
