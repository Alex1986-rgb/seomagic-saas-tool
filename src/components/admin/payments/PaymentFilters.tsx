
import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const PaymentFilters = memo(({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: PaymentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ID или клиенту..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Статус платежа" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="completed">Завершены</SelectItem>
          <SelectItem value="pending">В обработке</SelectItem>
          <SelectItem value="failed">Отклонены</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

PaymentFilters.displayName = 'PaymentFilters';

export default PaymentFilters;
