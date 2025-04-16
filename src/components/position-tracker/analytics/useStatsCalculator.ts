
import { PositionData } from '@/services/position/positionTracker';

interface StatsResult {
  totalKeywords: number;
  totalSearches: number;
  positionsInTop10: number;
  avgPosition: number;
  totalDomains: Set<string>;
  lastCheck: string;
}

export const useStatsCalculator = (history: PositionData[]) => {
  const calculateStats = (): StatsResult => {
    if (!history.length) return { 
      totalKeywords: 0, 
      totalSearches: 0, 
      positionsInTop10: 0, 
      avgPosition: 0,
      totalDomains: new Set(),
      lastCheck: ''
    };
    
    let totalKeywords = 0;
    let positionsInTop10 = 0;
    let positionSum = 0;
    let positionCount = 0;
    const domainsSet = new Set<string>();
    
    history.forEach(item => {
      domainsSet.add(item.domain);
      
      item.keywords.forEach(keyword => {
        totalKeywords++;
        
        if (keyword.position > 0 && keyword.position <= 10) {
          positionsInTop10++;
        }
        
        if (keyword.position > 0) {
          positionSum += keyword.position;
          positionCount++;
        }
      });
    });
    
    const avgPosition = positionCount > 0 ? Math.round(positionSum / positionCount) : 0;
    const lastCheck = history.length > 0 ? history[0].timestamp : '';
    
    return {
      totalKeywords,
      totalSearches: history.length,
      positionsInTop10,
      avgPosition,
      totalDomains: domainsSet,
      lastCheck
    };
  };

  return {
    calculateStats
  };
};

export default useStatsCalculator;
