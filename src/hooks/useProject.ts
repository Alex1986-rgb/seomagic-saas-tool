
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Project {
  id: string;
  name: string;
  url: string;
  created_at: string;
  settings: any;
}

export const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Загрузка проектов пользователя
  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      
      // Если есть проекты и не выбран текущий - выбираем первый
      if (data && data.length > 0 && !project) {
        setProject(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Ошибка загрузки проектов",
        description: error.message || "Не удалось загрузить проекты",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Выбор проекта по ID
  const selectProject = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      setProject(selectedProject);
      localStorage.setItem('selectedProjectId', projectId);
    }
  };

  // Загрузка проектов при изменении пользователя
  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Восстановление выбранного проекта из localStorage
  useEffect(() => {
    if (projects.length > 0) {
      const savedProjectId = localStorage.getItem('selectedProjectId');
      if (savedProjectId) {
        const savedProject = projects.find(p => p.id === savedProjectId);
        if (savedProject) {
          setProject(savedProject);
        } else {
          // Если сохраненного проекта нет, выбираем первый
          setProject(projects[0]);
        }
      } else {
        // Если нет сохраненного ID, выбираем первый проект
        setProject(projects[0]);
      }
    }
  }, [projects]);

  return {
    projects,
    project,
    isLoading,
    selectProject,
    fetchProjects
  };
};
