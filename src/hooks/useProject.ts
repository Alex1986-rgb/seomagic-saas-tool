
import { useState, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import { useToast } from './use-toast';
import type { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];

export function useProject(initialProject?: Project) {
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProject(id);
      setProject(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load project';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createProject = useCallback(async (name: string, url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.createProject(name, url);
      setProject(data);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.updateProject(id, updates);
      setProject(data);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    project,
    isLoading,
    error,
    loadProject,
    createProject,
    updateProject,
  };
}
