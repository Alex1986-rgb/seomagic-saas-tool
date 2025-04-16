
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [auditMetrics, setAuditMetrics] = useState({
    totalScans: 0,
    averageScore: 0,
    activeProjects: 0,
    trackedPositions: 0
  });
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const { data: audits, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (auditsError || projectsError) throw new Error('Error fetching dashboard data');

      setRecentAudits(audits || []);
      setProjectsCount(projectsCount || 0);
      
      // Calculate metrics
      const metrics = {
        totalScans: audits?.length || 0,
        averageScore: audits?.reduce((acc, curr) => acc + (curr.score || 0), 0) / (audits?.length || 1),
        activeProjects: projectsCount || 0,
        trackedPositions: 23 // Placeholder for now
      };
      
      setAuditMetrics(metrics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные дашборда",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    recentAudits,
    projectsCount,
    auditMetrics,
    fetchDashboardData
  };
};
