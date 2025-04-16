
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'];
type Audit = Database['public']['Tables']['audits']['Row'];
type CrawlResult = Database['public']['Tables']['crawl_results']['Row'];

export const projectService = {
  async createProject(name: string, url: string) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, url }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async createAudit(projectId: string, auditData: Omit<Audit, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('audits')
      .insert([{ ...auditData, project_id: projectId }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getProjectAudits(projectId: string) {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async saveCrawlResults(projectId: string, crawlData: Omit<CrawlResult, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('crawl_results')
      .insert([{ ...crawlData, project_id: projectId }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getProjectCrawlResults(projectId: string) {
    const { data, error } = await supabase
      .from('crawl_results')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
