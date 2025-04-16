
import type { AnalyticsData } from '../types/firecrawl';

export const mockDataGenerator = {
  generateTrends() {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    let currentValue = Math.floor(Math.random() * 20) + 60;
    
    return months.map(month => {
      const change = Math.floor(Math.random() * 7) - 2;
      currentValue = Math.min(Math.max(currentValue + change, 30), 100);
      
      return {
        name: month,
        value: currentValue
      };
    });
  },

  generateDistribution(totalPages: number) {
    return [
      { category: 'Отлично', count: Math.floor(totalPages * 0.4) },
      { category: 'Хорошо', count: Math.floor(totalPages * 0.3) },
      { category: 'Средне', count: Math.floor(totalPages * 0.2) },
      { category: 'Плохо', count: Math.floor(totalPages * 0.1) }
    ];
  }
};
