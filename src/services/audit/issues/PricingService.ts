import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type IssueCategory = Database['public']['Enums']['issue_category'];

interface PricingRule {
  id: string;
  rule_name: string;
  issue_type: string;
  category: IssueCategory;
  price_per_item: number;
  is_bundle: boolean;
  bundle_includes?: string[];
}

interface CostBreakdown {
  issue_type: string;
  rule_name: string;
  count: number;
  price_per_item: number;
  total_cost: number;
  category: IssueCategory;
}

export class PricingService {
  private static pricingRules: PricingRule[] | null = null;

  /**
   * Загружает правила ценообразования из базы данных
   */
  static async loadPricingRules(): Promise<PricingRule[]> {
    if (this.pricingRules) {
      return this.pricingRules;
    }

    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error loading pricing rules:', error);
      throw error;
    }

    this.pricingRules = data as PricingRule[];
    return this.pricingRules;
  }

  /**
   * Находит правило ценообразования для типа проблемы
   */
  static async findPricingRule(issueType: string): Promise<PricingRule | null> {
    const rules = await this.loadPricingRules();
    return rules.find(rule => rule.issue_type === issueType) || null;
  }

  /**
   * Рассчитывает стоимость для группы проблем
   */
  static async calculateIssueCosts(
    issues: Array<{ issue_type: string; category: IssueCategory }>
  ): Promise<{ breakdown: CostBreakdown[]; total: number }> {
    const rules = await this.loadPricingRules();
    
    // Группируем проблемы по типу
    const issueGroups = new Map<string, number>();
    issues.forEach(issue => {
      const count = issueGroups.get(issue.issue_type) || 0;
      issueGroups.set(issue.issue_type, count + 1);
    });

    const breakdown: CostBreakdown[] = [];
    let totalCost = 0;

    // Рассчитываем стоимость для каждого типа проблемы
    issueGroups.forEach((count, issueType) => {
      const rule = rules.find(r => r.issue_type === issueType);
      if (rule) {
        const itemCost = count * rule.price_per_item;
        breakdown.push({
          issue_type: issueType,
          rule_name: rule.rule_name,
          count,
          price_per_item: rule.price_per_item,
          total_cost: itemCost,
          category: rule.category
        });
        totalCost += itemCost;
      }
    });

    return { breakdown, total: totalCost };
  }

  /**
   * Применяет скидки для пакетных предложений
   */
  static async applyBundleDiscounts(
    breakdown: CostBreakdown[]
  ): Promise<{ breakdown: CostBreakdown[]; discount: number; finalTotal: number }> {
    const rules = await this.loadPricingRules();
    const bundleRules = rules.filter(r => r.is_bundle);

    let totalDiscount = 0;
    const issueTypes = new Set(breakdown.map(b => b.issue_type));

    // Проверяем каждый пакет
    for (const bundle of bundleRules) {
      if (!bundle.bundle_includes) continue;

      // Проверяем, есть ли все проблемы из пакета
      const hasAllIssues = bundle.bundle_includes.every(type => issueTypes.has(type));
      
      if (hasAllIssues) {
        // Рассчитываем стоимость пакета и обычную стоимость
        const bundleTotal = bundle.bundle_includes.reduce((sum, type) => {
          const item = breakdown.find(b => b.issue_type === type);
          return sum + (item?.total_cost || 0);
        }, 0);

        const bundlePrice = bundle.price_per_item;
        const discount = bundleTotal - bundlePrice;

        if (discount > 0) {
          totalDiscount += discount;
        }
      }
    }

    const originalTotal = breakdown.reduce((sum, b) => sum + b.total_cost, 0);
    
    return {
      breakdown,
      discount: totalDiscount,
      finalTotal: originalTotal - totalDiscount
    };
  }

  /**
   * Создает смету в базе данных
   */
  static async createEstimate(
    auditId: string,
    taskId: string,
    userId: string,
    breakdown: CostBreakdown[],
    totalCost: number,
    discount: number = 0
  ): Promise<string> {
    const finalCost = totalCost - discount;
    const totalIssues = breakdown.reduce((sum, b) => sum + b.count, 0);

    const { data, error } = await supabase
      .from('job_estimates')
      .insert({
        audit_id: auditId,
        task_id: taskId,
        user_id: userId,
        total_issues: totalIssues,
        total_cost: totalCost,
        discount_applied: discount,
        final_cost: finalCost,
        cost_breakdown: breakdown as any,
        status: 'draft'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating estimate:', error);
      throw error;
    }

    return data.id;
  }

  /**
   * Обновляет стоимость исправления для проблем
   */
  static async updateIssueCosts(taskId: string): Promise<void> {
    const { data: issues, error: fetchError } = await supabase
      .from('issues')
      .select('id, issue_type')
      .eq('task_id', taskId);

    if (fetchError || !issues) {
      console.error('Error fetching issues:', fetchError);
      return;
    }

    const rules = await this.loadPricingRules();

    for (const issue of issues) {
      const rule = rules.find(r => r.issue_type === issue.issue_type);
      if (rule) {
        await supabase
          .from('issues')
          .update({ fix_cost: rule.price_per_item })
          .eq('id', issue.id);
      }
    }
  }
}
