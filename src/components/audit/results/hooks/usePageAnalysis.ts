
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { seoApiService } from '@/api/seoApiService';

/**
 * Хук для получения и управления данными анализа страниц
 */
export const usePageAnalysis = (auditId: string | undefined) => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('url');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Получение данных анализа страниц с помощью React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['pageAnalysis', auditId],
    queryFn: () => auditId ? seoApiService.getPageAnalysis(auditId) : Promise.resolve([]),
    enabled: !!auditId
  });

  // Применение сортировки и фильтрации к данным
  const processedData = data
    ? data
        .filter(page => {
          if (filter === 'all') return true;
          if (filter === 'withIssues') return page.issues && page.issues.length > 0;
          if (filter === 'noMeta') return !page.meta_description || page.meta_description.length < 10;
          if (filter === 'slowPages') return page.load_time > 1.5;
          return true;
        })
        .sort((a, b) => {
          const sortField = sortBy as keyof typeof a;
          let result = 0;
          
          if (a[sortField] < b[sortField]) result = -1;
          if (a[sortField] > b[sortField]) result = 1;
          
          return sortOrder === 'asc' ? result : -result;
        })
    : [];
  
  // Обновление фильтра страниц
  const updateFilter = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  // Обновление поля и направления сортировки
  const updateSort = (field: string, order?: 'asc' | 'desc') => {
    setSortBy(field);
    if (order) {
      setSortOrder(order);
    } else {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    }
  };

  return {
    data: processedData,
    isLoading,
    error,
    filter,
    sortBy,
    sortOrder,
    updateFilter,
    updateSort
  };
};
