import { AuditData } from '@/types/audit';
import { fetchRecommendations, fetchAuditHistory } from '@/services/auditService';
import { PageContent } from '@/services/audit/optimization/types';
import { 
  detectBrokenLinks, 
  detectDuplicates, 
  analyzeSiteStructure, 
  analyzeContentUniqueness 
} from '@/services/audit/siteAnalysis';

type ProgressCallback = (current: number, total: number) => void;

class AuditApiService {
  /**
   * Получает данные аудита сайта
   * @deprecated Use auditService.startAudit() and auditService.getAuditStatus() instead
   */
  async getAuditData(url: string): Promise<AuditData> {
    throw new Error('getAuditData is deprecated. Use auditService.startAudit() and auditService.getAuditStatus() instead');
  }

  /**
   * Получает рекомендации для сайта
   */
  async getRecommendations(url: string): Promise<any> {
    try {
      return await fetchRecommendations(url);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Получает историю аудитов
   */
  async getAuditHistory(url: string): Promise<any> {
    try {
      return await fetchAuditHistory(url);
    } catch (error) {
      console.error('Error fetching audit history:', error);
      throw error;
    }
  }

  /**
   * Обнаружение битых ссылок
   */
  async findBrokenLinks(domain: string, urls: string[], onProgress?: ProgressCallback) {
    try {
      return await detectBrokenLinks(domain, urls, onProgress);
    } catch (error) {
      console.error('Error detecting broken links:', error);
      throw error;
    }
  }

  /**
   * Обнаружение дубликатов
   */
  async findDuplicates(urls: string[], onProgress?: ProgressCallback) {
    try {
      return await detectDuplicates(urls, onProgress);
    } catch (error) {
      console.error('Error detecting duplicates:', error);
      throw error;
    }
  }

  /**
   * Анализ структуры сайта
   */
  async analyzeSiteStructure(domain: string, urls: string[], onProgress?: ProgressCallback) {
    try {
      return await analyzeSiteStructure(domain, urls, onProgress);
    } catch (error) {
      console.error('Error analyzing site structure:', error);
      throw error;
    }
  }

  /**
   * Анализ уникальности контента
   */
  async analyzeContentUniqueness(urls: string[], onProgress?: ProgressCallback) {
    try {
      return await analyzeContentUniqueness(urls, onProgress);
    } catch (error) {
      console.error('Error analyzing content uniqueness:', error);
      throw error;
    }
  }

  /**
   * Оптимизация контента страниц
   */
  async optimizeContent(pagesContent: PageContent[], domain: string) {
    try {
      // В реальном приложении этот метод отправлял бы данные на сервер
      // для выполнения оптимизации контента с помощью ИИ
      console.log(`Запрос на оптимизацию контента для ${domain}`);
      
      // Симуляция задержки
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Симуляция результата
      return {
        success: true,
        message: "Контент успешно оптимизирован",
        optimizedPages: pagesContent.map(page => ({
          ...page,
          optimized: {
            content: page.content + " (оптимизировано)",
            meta: {
              description: page.meta.description 
                ? page.meta.description + " (улучшено)" 
                : "Новое мета-описание для " + page.title,
              keywords: "keywords, seo, optimization"
            },
            score: Math.floor(Math.random() * 20) + 80
          }
        }))
      };
    } catch (error) {
      console.error('Error optimizing content:', error);
      throw error;
    }
  }
}

export const auditApiService = new AuditApiService();
