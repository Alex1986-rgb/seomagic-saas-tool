
import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuditFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по URL..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          <span>Фильтр по дате</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>Фильтры</span>
        </Button>
      </div>
    </div>
  );
};

