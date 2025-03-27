
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PositionData } from '@/services/position/positionTracker';
import { TopKeywordsTable } from '@/components/position-tracker/analytics';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download, FileSpreadsheet, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KeywordsTabProps {
  history: PositionData[];
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('position');
  const [filterBy, setFilterBy] = useState('all');

  const allKeywords = history.length > 0 
    ? history[0].keywords.map(k => k.keyword)
    : [];

  const filteredKeywords = searchTerm 
    ? allKeywords.filter(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    : allKeywords;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Ключевые слова</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Импорт</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Добавить ключи</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="text-base font-medium mb-3">Всего ключевых слов</h3>
          <p className="text-3xl font-bold">{allKeywords.length}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-base font-medium mb-3">В ТОП-10</h3>
          <p className="text-3xl font-bold text-green-500">
            {history.length > 0 
              ? history[0].keywords.filter(k => k.position > 0 && k.position <= 10).length 
              : 0}
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="text-base font-medium mb-3">Не в индексе</h3>
          <p className="text-3xl font-bold text-red-500">
            {history.length > 0 
              ? history[0].keywords.filter(k => k.position === 0).length 
              : 0}
          </p>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск ключевых слов"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="position">По позиции</SelectItem>
              <SelectItem value="alphabetical">По алфавиту</SelectItem>
              <SelectItem value="change">По изменению</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все ключи</SelectItem>
              <SelectItem value="top10">ТОП-10</SelectItem>
              <SelectItem value="top30">ТОП-30</SelectItem>
              <SelectItem value="notIndexed">Не в индексе</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">SEO оптимизация</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">продвижение сайта</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">аудит сайта</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">проверка позиций</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">анализ сайта</Badge>
      </div>

      <Card>
        <TopKeywordsTable 
          history={history} 
          searchTerm={searchTerm}
          sortBy={sortBy as any}
          filterBy={filterBy as any}
        />
      </Card>
    </div>
  );
};

export default KeywordsTab;
