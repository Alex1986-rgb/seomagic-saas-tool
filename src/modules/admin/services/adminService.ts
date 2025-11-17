import { supabase } from '@/integrations/supabase/client';
import type { AdminUser, AdminStats, ApiLog } from '../types';

export class AdminService {
  /**
   * Получает системную статистику через Edge Function
   */
  async getSystemStats(): Promise<AdminStats> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-stats', {
        body: { type: 'system' }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }

  /**
   * Получает список всех пользователей
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'list' }
      });

      if (error) throw error;
      return data?.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Получает все аудиты (для админа)
   */
  async getAllAudits() {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all audits:', error);
      throw error;
    }
  }

  /**
   * Получает API логи
   */
  async getApiLogs(limit: number = 50): Promise<ApiLog[]> {
    try {
      const { data, error } = await supabase
        .from('api_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching API logs:', error);
      throw error;
    }
  }

  /**
   * Обновляет роль пользователя
   */
  async updateUserRole(userId: string, role: string) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
