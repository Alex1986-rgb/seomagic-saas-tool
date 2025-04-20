
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResultsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  search: string;
  type: string;
  status: string;
}

export const ResultsFilter: React.FC<ResultsFilterProps> = ({
  onFilterChange
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    search: '',
    type: 'all',
    status: 'all'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по URL..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex gap-4">
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип страницы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="product">Товары</SelectItem>
            <SelectItem value="category">Категории</SelectItem>
            <SelectItem value="article">Статьи</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="ok">Без проблем</SelectItem>
            <SelectItem value="warning">Предупреждения</SelectItem>
            <SelectItem value="error">Ошибки</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
