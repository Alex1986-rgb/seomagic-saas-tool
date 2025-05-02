
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PositionData } from '@/services/position/positionTracker';
import { StatCard } from '@/components/position-tracker/analytics';
import { KeywordPositionTrend } from '@/components/position-tracker/analytics';
import { TrendingUp, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrendsTabProps {
  history: PositionData[];
}

const TrendsTab: React.FC<TrendsTabProps> = ({ history }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Get available keywords from history
  const getAvailableKeywords = () => {
    const keywordsSet = new Set<string>();
    
    history.forEach(item => {
      item.keywords.forEach(keyword => {
        keywordsSet.add(keyword.keyword);
      });
    });
    
    return Array.from(keywordsSet);
  };
  
  const availableKeywords = getAvailableKeywords();
  
  // Filter keywords by search term
  const filteredKeywords = searchTerm 
    ? availableKeywords.filter(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableKeywords;
  
  // Calculate position changes for stats
  const calculatePositionChanges = () => {
    // If no history or only one entry, return defaults
    if (history.length < 2) {
      return { improved: 0, worsened: 0, unchanged: 0 };
    }
    
    let improved = 0, worsened = 0, unchanged = 0;
    const latestEntry = history[0];
    const previousEntry = history[1];
    
    // Map of keywords in previous entry
    const prevKeywords = new Map();
    previousEntry.keywords.forEach(k => {
      prevKeywords.set(k.keyword, k.position);
    });
    
    // Compare positions
    latestEntry.keywords.forEach(keyword => {
      const prevPos = prevKeywords.get(keyword.keyword);
      if (prevPos === undefined) return;
      
      if (keyword.position === 0 || prevPos === 0) {
        // Skip not found positions
        return;
      }
      
      if (keyword.position < prevPos) {
        improved++;
      } else if (keyword.position > prevPos) {
        worsened++;
      } else {
        unchanged++;
      }
    });
    
    return { improved, worsened, unchanged };
  };
  
  const changes = calculatePositionChanges();
  
  // Get average position change
  const getAveragePositionChange = () => {
    if (history.length < 2) return 0;
    
    const latestEntry = history[0];
    const previousEntry = history[1];
    let totalChange = 0;
    let count = 0;
    
    // Map of keywords in previous entry
    const prevKeywords = new Map();
    previousEntry.keywords.forEach(k => {
      prevKeywords.set(k.keyword, k.position);
    });
    
    // Calculate changes
    latestEntry.keywords.forEach(keyword => {
      const prevPos = prevKeywords.get(keyword.keyword);
      if (prevPos === undefined || keyword.position === 0 || prevPos === 0) return;
      
      totalChange += (prevPos - keyword.position);
      count++;
    });
    
    return count > 0 ? totalChange / count : 0;
  };
  
  const avgChange = getAveragePositionChange();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Улучшили позиции" 
          value={changes.improved}
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          trend="up"
          trendValue={`${Math.round((changes.improved / (changes.improved + changes.worsened + changes.unchanged || 1)) * 100)}%`}
        />
        <StatCard 
          title="Ухудшили позиции" 
          value={changes.worsened}
          icon={<ArrowDown className="h-4 w-4 text-red-500" />}
          trend="down"
          trendValue={`${Math.round((changes.worsened / (changes.improved + changes.worsened + changes.unchanged || 1)) * 100)}%`}
        />
        <StatCard 
          title="Средний прирост" 
          value={avgChange > 0 ? `+${avgChange.toFixed(1)}` : avgChange.toFixed(1)}
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          trend={avgChange > 0 ? "up" : avgChange < 0 ? "down" : "neutral"}
          trendValue="позиций"
        />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Поиск ключевых слов..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select 
                value={selectedKeyword} 
                onValueChange={setSelectedKeyword}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ключевое слово" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {filteredKeywords.map((keyword, index) => (
                    <SelectItem key={index} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <KeywordPositionTrend 
            history={history}
            keyword={selectedKeyword}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsTab;
