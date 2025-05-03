
import { PositionData } from './positionTracker';

// Get historical data for a domain
export const getHistoricalData = async (domain?: string): Promise<PositionData[]> => {
  try {
    const historyJson = localStorage.getItem('position_history');
    const history: PositionData[] = historyJson ? JSON.parse(historyJson) : [];
    
    if (domain) {
      return history.filter(item => item.domain === domain);
    }
    
    return history;
  } catch (error) {
    console.error('Ошибка получения исторических данных:', error);
    return [];
  }
};

// Alias getHistoricalData as getPositionHistory for backward compatibility
export const getPositionHistory = getHistoricalData;

// Save a new position check result to history
export const saveToHistory = (result: PositionData): void => {
  try {
    const historyJson = localStorage.getItem('position_history');
    let history: PositionData[] = historyJson ? JSON.parse(historyJson) : [];
    
    // Add the new result to the beginning of the history array
    history.unshift(result);
    
    // Limit the history size (for performance reasons)
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    
    // Save the updated history
    localStorage.setItem('position_history', JSON.stringify(history));
    
    // Dispatch an event to notify other components
    window.dispatchEvent(new CustomEvent('position-history-updated'));
  } catch (error) {
    console.error('Ошибка сохранения в историю:', error);
  }
};

// Clear history for a domain or all history
export const clearHistory = (domain?: string): void => {
  try {
    if (domain) {
      const historyJson = localStorage.getItem('position_history');
      const history: PositionData[] = historyJson ? JSON.parse(historyJson) : [];
      const filteredHistory = history.filter(item => item.domain !== domain);
      localStorage.setItem('position_history', JSON.stringify(filteredHistory));
    } else {
      localStorage.removeItem('position_history');
    }
    
    // Dispatch an event to notify other components
    window.dispatchEvent(new CustomEvent('position-history-updated'));
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
  }
};
