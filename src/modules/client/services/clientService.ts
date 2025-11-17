import { supabase } from '@/integrations/supabase/client';
import type { ClientProfile, ClientDashboardStats } from '../types';

export class ClientService {
  /**
   * Получает профиль текущего пользователя
   */
  async getProfile(): Promise<ClientProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Обновляет профиль пользователя
   */
  async updateProfile(profile: Partial<ClientProfile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Получает статистику для дашборда клиента
   */
  async getDashboardStats(): Promise<ClientDashboardStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Получаем все аудиты пользователя
      const { data: audits, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user.id);

      if (auditsError) throw auditsError;

      // Получаем все отчеты пользователя
      const { data: reports, error: reportsError } = await supabase
        .from('pdf_reports')
        .select('*')
        .eq('user_id', user.id);

      if (reportsError) throw reportsError;

      // Вычисляем статистику
      const completedAudits = audits?.filter(a => a.status === 'completed') || [];
      const avgScore = completedAudits.length > 0
        ? completedAudits.reduce((sum, a) => sum + (a.seo_score || 0), 0) / completedAudits.length
        : 0;

      return {
        total_audits: audits?.length || 0,
        completed_audits: completedAudits.length,
        total_reports: reports?.length || 0,
        average_seo_score: Math.round(avgScore),
        recent_audits: audits?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();
