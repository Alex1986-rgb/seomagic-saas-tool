import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { EstimateGroupItem } from './EstimateSelectors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maps audit optimization items to selectable estimate items
 */
export const mapAuditItemsToSelectable = (
  items: OptimizationItem[],
  defaultSelected: boolean = true
): Record<string, EstimateGroupItem> => {
  const mapped: Record<string, EstimateGroupItem> = {};
  
  items.forEach((item) => {
    const key = generateKeyFromName(item.name);
    mapped[key] = {
      key,
      label: item.name,
      description: `${item.count} ${item.count === 1 ? 'страница' : 'страниц'} × ${item.price}₽`,
      selected: item.priority === 'high' ? true : defaultSelected,
      disabled: false,
    };
  });
  
  return mapped;
};

/**
 * Generates groups for EstimateSelectors from audit data
 */
export const generateGroupsFromAuditData = (
  items: OptimizationItem[],
  selectedKeys: Set<string>
): Array<{ title: string; items: EstimateGroupItem[] }> => {
  const technicalItems: EstimateGroupItem[] = [];
  const contentItems: EstimateGroupItem[] = [];
  const resultItems: EstimateGroupItem[] = [];
  
  items.forEach((item) => {
    const key = generateKeyFromName(item.name);
    const groupItem: EstimateGroupItem = {
      key,
      label: item.name,
      description: `${item.count} ${item.count === 1 ? 'страница' : 'страниц'} × ${item.price}₽ = ${item.totalPrice}₽`,
      selected: selectedKeys.has(key),
      disabled: false,
    };
    
    // Categorize by type
    if (item.category === 'technical' || item.category === 'meta' || item.category === 'links' || item.category === 'performance') {
      technicalItems.push(groupItem);
    } else if (item.category === 'content' || item.category === 'structure') {
      contentItems.push(groupItem);
    } else {
      resultItems.push(groupItem);
    }
  });
  
  return [
    {
      title: '📦 Технические улучшения',
      items: technicalItems,
    },
    {
      title: '✍️ Контентные улучшения',
      items: contentItems,
    },
    ...(resultItems.length > 0 ? [{
      title: '📈 Результаты работы',
      items: resultItems,
    }] : []),
  ];
};

/**
 * Generates a key from item name
 */
export const generateKeyFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
};

/**
 * Creates optimization items from selected keys
 */
export const createSelectedItems = (
  allItems: OptimizationItem[],
  selectedKeys: Set<string>
): OptimizationItem[] => {
  return allItems.filter((item) => {
    const key = generateKeyFromName(item.name);
    return selectedKeys.has(key);
  });
};

/**
 * Calculates priority statistics
 */
export const getPriorityStats = (items: OptimizationItem[]) => {
  const high = items.filter(i => i.priority === 'high').length;
  const medium = items.filter(i => i.priority === 'medium').length;
  const low = items.filter(i => i.priority === 'low').length;
  
  return { high, medium, low };
};

/**
 * Gets priority color class
 */
export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return 'border-red-500 border-2';
    case 'medium':
      return 'border-yellow-500 border-2';
    case 'low':
      return 'border-gray-500';
    default:
      return '';
  }
};

/**
 * Gets priority badge text
 */
export const getPriorityBadge = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return 'Критично';
    case 'medium':
      return 'Важно';
    case 'low':
      return 'Желательно';
    default:
      return '';
  }
};

/**
 * Validates selection (at least one high-priority item should be selected)
 */
export const validateSelection = (
  allItems: OptimizationItem[],
  selectedKeys: Set<string>
): { valid: boolean; warning?: string } => {
  if (selectedKeys.size === 0) {
    return {
      valid: false,
      warning: 'Выберите хотя бы один элемент для оптимизации',
    };
  }
  
  const highPriorityItems = allItems.filter(i => i.priority === 'high');
  const selectedHighPriority = highPriorityItems.filter(i => 
    selectedKeys.has(generateKeyFromName(i.name))
  );
  
  if (highPriorityItems.length > 0 && selectedHighPriority.length === 0) {
    return {
      valid: true,
      warning: '⚠️ Вы не выбрали критические элементы. Это может снизить эффективность оптимизации.',
    };
  }
  
  return { valid: true };
};
