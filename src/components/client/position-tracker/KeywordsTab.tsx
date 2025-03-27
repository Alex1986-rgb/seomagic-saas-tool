
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowDownAZ, ArrowUp } from 'lucide-react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TopKeywordsTable } from '@/components/position-tracker/analytics';

interface KeywordsTabProps {
  history: PositionData[];
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'position' | 'alphabetical' | 'change'>('position');
  const [filterBy, setFilterBy] = useState<'all' | 'top10' | 'top30' | 'notIndexed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-auto flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по ключевым словам..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
          </Button>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-1">
                <ArrowDownAZ className="h-4 w-4" />
                <span>Сортировка</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="position">По позиции</SelectItem>
              <SelectItem value="alphabetical">По алфавиту</SelectItem>
              <SelectItem value="change">По изменению</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Фильтр по позиции</h4>
                <Select value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите позицию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все позиции</SelectItem>
                    <SelectItem value="top10">ТОП-10</SelectItem>
                    <SelectItem value="top30">ТОП-30</SelectItem>
                    <SelectItem value="notIndexed">Не найдено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Поисковая система</h4>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите поисковик" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все поисковики</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="yandex">Яндекс</SelectItem>
                    <SelectItem value="mailru">Mail.ru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Дополнительно</h4>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Другие фильтры" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Без фильтра</SelectItem>
                    <SelectItem value="rising">Растущие позиции</SelectItem>
                    <SelectItem value="falling">Падающие позиции</SelectItem>
                    <SelectItem value="stable">Стабильные позиции</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <TopKeywordsTable 
        history={history} 
        searchTerm={searchTerm}
        sortBy={sortBy}
        filterBy={filterBy}
      />
    </div>
  );
};

export default KeywordsTab;
