
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    queryFn: async () => {
      if (!auditId) return [];
      
      const { data: analysisData, error } = await supabase
        .from('page_analysis')
        .select('*')
        .eq('audit_id', auditId);
      
      if (error) throw error;
      
      return (analysisData || []).map(item => ({
        url: item.url,
        title: item.title || '',
        metaDescription: item.meta_description || '',
        h1Count: item.h1_count || 0,
        imageCount: item.image_count || 0,
        wordCount: item.word_count || 0,
        loadTime: item.load_time || 0,
        statusCode: item.status_code || 200
      }));
    },
    enabled: !!auditId
  });

  // Применение сортировки и фильтрации к данным
  const processedData = data
    ? data
        .filter(page => {
          if (filter === 'all') return true;
          if (filter === 'noMeta') return !page.metaDescription || page.metaDescription.length < 10;
          if (filter === 'slowPages') return page.loadTime > 1.5;
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
