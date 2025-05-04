
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getHistoricalData, clearHistory } from '@/services/position/positionHistory';
import { PositionData } from '@/services/position/positionTracker';
import { PositionTrackerResults } from './PositionTrackerResults';
import { History, Search, Trash2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function PositionTrackerHistory() {
  const [history, setHistory] = useState<PositionData[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PositionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PositionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadHistory = async () => {
    const data = await getHistoricalData();
    setHistory(data);
    setFilteredHistory(data);
  };

  useEffect(() => {
    loadHistory();
    
    const handleHistoryUpdated = () => {
      loadHistory();
    };
    
    window.addEventListener('position-history-updated', handleHistoryUpdated);
    
    return () => {
      window.removeEventListener('position-history-updated', handleHistoryUpdated);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredHistory(
        history.filter(item => 
          item.domain.includes(searchTerm.toLowerCase()) || 
          item.keywords.some(k => k.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredHistory(history);
    }
  }, [searchTerm, history]);

  const handleClear = async () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю проверок?')) {
      await clearHistory();
      setHistory([]);
      setFilteredHistory([]);
      toast({
        title: "История очищена",
        description: "Вся история проверок позиций была удалена"
      });
    }
  };

  const handleViewDetails = (item: PositionData) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h2 className="text-xl font-bold">История проверок позиций</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={loadHistory} title="Обновить">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClear} title="Очистить историю">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Поиск по домену или ключевому слову..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {history.length === 0 
                ? 'История проверок позиций пуста' 
                : 'Нет результатов, соответствующих поисковому запросу'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 py-4">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{item.domain}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
                    Подробнее
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  {formatDate(item.timestamp || item.date || '')}
                </p>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <div>
                    <span className="font-medium">Поисковая система:</span>{' '}
                    {item.searchEngine}
                  </div>
                  <div className="ml-4">
                    <span className="font-medium">Ключевые слова:</span>{' '}
                    {item.keywords.length}
                  </div>
                  <div className="ml-4">
                    <span className="font-medium">Регион:</span>{' '}
                    {item.region || 'Не указан'}
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-muted-foreground">
                        TOP-10: {item.keywords.filter(k => k.position > 0 && k.position <= 10).length}
                      </div>
                      <div className="text-sm text-muted-foreground ml-2">
                        TOP-30: {item.keywords.filter(k => k.position > 0 && k.position <= 30).length}
                      </div>
                      <div className="text-sm text-muted-foreground ml-2">
                        Не найдено: {item.keywords.filter(k => k.position === 0).length}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали проверки позиций</DialogTitle>
          </DialogHeader>
          {selectedItem && <PositionTrackerResults data={selectedItem} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
