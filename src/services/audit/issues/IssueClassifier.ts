import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type IssueCategory = Database['public']['Enums']['issue_category'];
type IssueSeverity = Database['public']['Enums']['issue_severity'];

export interface ClassifiedIssue {
  issue_type: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  recommendation?: string;
  metadata?: Record<string, any>;
  can_auto_fix: boolean;
  page_id?: string;
}

export class IssueClassifier {
  /**
   * Классифицирует проблемы SEO
   */
  static classifySEOIssues(pageData: any): ClassifiedIssue[] {
    const issues: ClassifiedIssue[] = [];

    // Missing title
    if (!pageData.title || pageData.title.trim().length === 0) {
      issues.push({
        issue_type: 'missing_title',
        category: 'seo',
        severity: 'critical',
        description: `Missing title tag on ${pageData.url}`,
        recommendation: 'Add a descriptive title tag (50-60 characters)',
        can_auto_fix: true,
        metadata: { url: pageData.url }
      });
    }

    // Missing meta description
    if (!pageData.meta_description || pageData.meta_description.trim().length === 0) {
      issues.push({
        issue_type: 'missing_meta_description',
        category: 'seo',
        severity: 'high',
        description: `Missing meta description on ${pageData.url}`,
        recommendation: 'Add a compelling meta description (150-160 characters)',
        can_auto_fix: true,
        metadata: { url: pageData.url }
      });
    }

    // Missing H1
    if (pageData.h1_count === 0) {
      issues.push({
        issue_type: 'missing_h1',
        category: 'seo',
        severity: 'high',
        description: `Missing H1 heading on ${pageData.url}`,
        recommendation: 'Add a single H1 heading with main keyword',
        can_auto_fix: true,
        metadata: { url: pageData.url }
      });
    }

    // Multiple H1s
    if (pageData.h1_count > 1) {
      issues.push({
        issue_type: 'multiple_h1',
        category: 'seo',
        severity: 'medium',
        description: `Multiple H1 headings (${pageData.h1_count}) on ${pageData.url}`,
        recommendation: 'Use only one H1 heading per page',
        can_auto_fix: true,
        metadata: { url: pageData.url, count: pageData.h1_count }
      });
    }

    // Missing canonical
    if (!pageData.has_canonical) {
      issues.push({
        issue_type: 'missing_canonical',
        category: 'seo',
        severity: 'medium',
        description: `Missing canonical tag on ${pageData.url}`,
        recommendation: 'Add canonical tag to prevent duplicate content issues',
        can_auto_fix: true,
        metadata: { url: pageData.url }
      });
    }

    // Not indexable
    if (!pageData.is_indexable) {
      issues.push({
        issue_type: 'not_indexable',
        category: 'seo',
        severity: 'high',
        description: `Page not indexable: ${pageData.url}`,
        recommendation: 'Check robots meta tag and X-Robots-Tag header',
        can_auto_fix: false,
        metadata: { 
          url: pageData.url,
          robots_meta: pageData.robots_meta,
          x_robots_tag: pageData.x_robots_tag
        }
      });
    }

    return issues;
  }

  /**
   * Классифицирует технические проблемы
   */
  static classifyTechnicalIssues(pageData: any): ClassifiedIssue[] {
    const issues: ClassifiedIssue[] = [];

    // Slow page load
    if (pageData.load_time && pageData.load_time > 3000) {
      issues.push({
        issue_type: 'slow_load_time',
        category: 'performance',
        severity: pageData.load_time > 5000 ? 'critical' : 'high',
        description: `Slow page load time (${(pageData.load_time / 1000).toFixed(2)}s) on ${pageData.url}`,
        recommendation: 'Optimize images, minify CSS/JS, enable compression',
        can_auto_fix: false,
        metadata: { url: pageData.url, load_time: pageData.load_time }
      });
    }

    // High TTFB
    if (pageData.ttfb && pageData.ttfb > 600) {
      issues.push({
        issue_type: 'high_ttfb',
        category: 'performance',
        severity: 'high',
        description: `High Time to First Byte (${pageData.ttfb}ms) on ${pageData.url}`,
        recommendation: 'Optimize server response time, use CDN, enable caching',
        can_auto_fix: false,
        metadata: { url: pageData.url, ttfb: pageData.ttfb }
      });
    }

    // No compression
    if (!pageData.is_compressed) {
      issues.push({
        issue_type: 'no_compression',
        category: 'performance',
        severity: 'medium',
        description: `Content not compressed on ${pageData.url}`,
        recommendation: 'Enable gzip or brotli compression on server',
        can_auto_fix: false,
        metadata: { url: pageData.url }
      });
    }

    // No viewport meta
    if (!pageData.has_viewport) {
      issues.push({
        issue_type: 'missing_viewport',
        category: 'accessibility',
        severity: 'high',
        description: `Missing viewport meta tag on ${pageData.url}`,
        recommendation: 'Add viewport meta tag for mobile responsiveness',
        can_auto_fix: true,
        metadata: { url: pageData.url }
      });
    }

    // Redirect chains
    if (pageData.redirect_chain_length && pageData.redirect_chain_length > 1) {
      issues.push({
        issue_type: 'redirect_chain',
        category: 'technical',
        severity: pageData.redirect_chain_length > 2 ? 'high' : 'medium',
        description: `Redirect chain (${pageData.redirect_chain_length} redirects) on ${pageData.url}`,
        recommendation: 'Update links to point directly to final destination',
        can_auto_fix: false,
        metadata: { 
          url: pageData.url, 
          chain_length: pageData.redirect_chain_length,
          final_url: pageData.final_url
        }
      });
    }

    return issues;
  }

  /**
   * Классифицирует проблемы контента
   */
  static classifyContentIssues(pageData: any): ClassifiedIssue[] {
    const issues: ClassifiedIssue[] = [];

    // Thin content
    if (pageData.has_thin_content || (pageData.word_count && pageData.word_count < 300)) {
      issues.push({
        issue_type: 'thin_content',
        category: 'content',
        severity: 'high',
        description: `Thin content (${pageData.word_count || 0} words) on ${pageData.url}`,
        recommendation: 'Add more valuable content (minimum 300 words recommended)',
        can_auto_fix: true,
        metadata: { url: pageData.url, word_count: pageData.word_count }
      });
    }

    // Missing alt text on images
    if (pageData.missing_alt_images_count && pageData.missing_alt_images_count > 0) {
      issues.push({
        issue_type: 'missing_image_alt',
        category: 'accessibility',
        severity: 'medium',
        description: `${pageData.missing_alt_images_count} images missing alt text on ${pageData.url}`,
        recommendation: 'Add descriptive alt text to all images',
        can_auto_fix: true,
        metadata: { 
          url: pageData.url, 
          missing_count: pageData.missing_alt_images_count 
        }
      });
    }

    // Poor heading structure
    if (pageData.h1_count === 0 || pageData.h2_count === 0) {
      issues.push({
        issue_type: 'poor_heading_structure',
        category: 'content',
        severity: 'medium',
        description: `Poor heading structure on ${pageData.url}`,
        recommendation: 'Use proper heading hierarchy (H1 > H2 > H3)',
        can_auto_fix: true,
        metadata: { 
          url: pageData.url,
          h1_count: pageData.h1_count,
          h2_count: pageData.h2_count,
          h3_count: pageData.h3_count
        }
      });
    }

    // Low text-to-HTML ratio
    if (pageData.text_html_ratio && pageData.text_html_ratio < 0.15) {
      issues.push({
        issue_type: 'low_text_html_ratio',
        category: 'content',
        severity: 'medium',
        description: `Low text-to-HTML ratio (${(pageData.text_html_ratio * 100).toFixed(1)}%) on ${pageData.url}`,
        recommendation: 'Increase text content or reduce HTML markup',
        can_auto_fix: false,
        metadata: { 
          url: pageData.url, 
          ratio: pageData.text_html_ratio 
        }
      });
    }

    return issues;
  }

  /**
   * Классифицирует все проблемы для страницы
   */
  static classifyPageIssues(pageData: any): ClassifiedIssue[] {
    return [
      ...this.classifySEOIssues(pageData),
      ...this.classifyTechnicalIssues(pageData),
      ...this.classifyContentIssues(pageData)
    ];
  }

  /**
   * Сохраняет проблемы в базу данных
   */
  static async saveIssuesToDatabase(
    issues: ClassifiedIssue[],
    auditId: string,
    taskId: string,
    userId: string
  ): Promise<void> {
    if (issues.length === 0) return;

    const { error } = await supabase
      .from('issues')
      .insert(
        issues.map(issue => ({
          audit_id: auditId,
          task_id: taskId,
          user_id: userId,
          ...issue
        }))
      );

    if (error) {
      console.error('Error saving issues:', error);
      throw error;
    }
  }
}
