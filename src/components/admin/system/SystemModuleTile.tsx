
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';

interface SystemModuleTileProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  badge?: React.ReactNode;
  onClick: () => void;
}

const SystemModuleTile: React.FC<SystemModuleTileProps> = ({
  icon,
  label,
  desc,
  badge,
  onClick
}) => {
  return (
    <Card 
      className="cursor-pointer group hover:scale-[1.03] transition-transform shadow border bg-gradient-to-br from-blue-600/5 to-indigo-600/5"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Перейти на страницу ${label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <CardContent className="py-5 px-4 flex items-start gap-4">
        <div className="rounded-lg bg-secondary/80 p-3">{icon}</div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-md group-hover:text-primary transition">{label}</span>
            {badge}
          </div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemModuleTile;
