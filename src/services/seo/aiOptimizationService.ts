
export interface SeoOptimizationRequest {
  content: string;
  targetKeywords?: string[];
  currentTitle?: string;
  currentDescription?: string;
  currentHeadings?: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
}

export interface OptimizedSeoElement {
  original: string;
  optimized: string;
  score: number;
  improvements: string[];
  characterCount: number;
  keywordDensity: number;
}

export interface SeoOptimizationResponse {
  title: OptimizedSeoElement;
  metaDescription: OptimizedSeoElement;
  keywords: {
    primary: string[];
    secondary: string[];
    longTail: string[];
    relevanceScore: number;
  };
  headings: {
    h1: OptimizedSeoElement[];
    h2: OptimizedSeoElement[];
    h3: OptimizedSeoElement[];
  };
  overallScore: number;
  recommendations: string[];
}

class AiOptimizationService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async optimizeSeoElements(request: SeoOptimizationRequest): Promise<SeoOptimizationResponse> {
    if (!this.apiKey) {
      throw new Error('API ключ не установлен для оптимизации');
    }

    try {
      // В реальной реализации здесь будет запрос к OpenAI API
      // Пока что возвращаем mock данные для демонстрации
      return this.generateMockOptimization(request);
    } catch (error) {
      console.error('Ошибка при оптимизации SEO элементов:', error);
      throw error;
    }
  }

  private generateMockOptimization(request: SeoOptimizationRequest): SeoOptimizationResponse {
    const contentWords = request.content.toLowerCase().split(' ');
    const keywordFrequency = this.analyzeKeywordFrequency(contentWords);
    
    return {
      title: {
        original: request.currentTitle || 'Исходный заголовок',
        optimized: this.optimizeTitle(request.content, request.targetKeywords),
        score: 92,
        improvements: [
          'Добавлены целевые ключевые слова',
          'Оптимизирована длина (55 символов)',
          'Улучшена читаемость'
        ],
        characterCount: 55,
        keywordDensity: 3.5
      },
      metaDescription: {
        original: request.currentDescription || 'Исходное описание',
        optimized: this.optimizeMetaDescription(request.content, request.targetKeywords),
        score: 88,
        improvements: [
          'Добавлен призыв к действию',
          'Включены LSI ключевые слова',
          'Оптимизирована длина (155 символов)'
        ],
        characterCount: 155,
        keywordDensity: 2.8
      },
      keywords: {
        primary: request.targetKeywords || this.extractPrimaryKeywords(keywordFrequency),
        secondary: this.generateSecondaryKeywords(request.content),
        longTail: this.generateLongTailKeywords(request.content),
        relevanceScore: 95
      },
      headings: {
        h1: [{
          original: request.currentHeadings?.h1[0] || 'Исходный H1',
          optimized: this.optimizeH1(request.content, request.targetKeywords),
          score: 90,
          improvements: ['Включены основные ключевые слова', 'Улучшена структура'],
          characterCount: 60,
          keywordDensity: 4.2
        }],
        h2: this.optimizeH2Headings(request.content, request.targetKeywords),
        h3: []
      },
      overallScore: 90,
      recommendations: [
        'Добавьте внутренние ссылки на связанные страницы',
        'Увеличьте количество H2 заголовков для лучшей структуры',
        'Включите больше LSI ключевых слов в контент',
        'Оптимизируйте alt-теги изображений'
      ]
    };
  }

  private analyzeKeywordFrequency(words: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    const stopWords = new Set(['и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'из', 'к', 'о', 'об', 'при', 'про', 'без', 'через', 'над', 'под', 'перед', 'за', 'между', 'среди', 'вокруг', 'около', 'вблизи', 'вдоль', 'вместо', 'кроме', 'сквозь', 'согласно', 'благодаря', 'вопреки', 'навстречу']);
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
      }
    });
    
    return frequency;
  }

  private extractPrimaryKeywords(frequency: Record<string, number>): string[] {
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private optimizeTitle(content: string, keywords?: string[]): string {
    const primaryKeyword = keywords?.[0] || 'оптимизация';
    return `${primaryKeyword} - Профессиональные услуги | Компания`;
  }

  private optimizeMetaDescription(content: string, keywords?: string[]): string {
    const primaryKeyword = keywords?.[0] || 'услуги';
    return `Качественные ${primaryKeyword} от профессионалов. Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу. Звоните сейчас!`;
  }

  private optimizeH1(content: string, keywords?: string[]): string {
    const primaryKeyword = keywords?.[0] || 'услуги';
    return `Профессиональные ${primaryKeyword} высокого качества`;
  }

  private optimizeH2Headings(content: string, keywords?: string[]): OptimizedSeoElement[] {
    return [
      {
        original: 'Подзаголовок 1',
        optimized: 'Преимущества наших услуг',
        score: 85,
        improvements: ['Добавлен коммерческий интент'],
        characterCount: 28,
        keywordDensity: 2.1
      },
      {
        original: 'Подзаголовок 2',
        optimized: 'Как заказать наши услуги',
        score: 87,
        improvements: ['Включен призыв к действию'],
        characterCount: 26,
        keywordDensity: 1.8
      }
    ];
  }

  private generateSecondaryKeywords(content: string): string[] {
    return ['качество', 'профессионально', 'быстро', 'недорого', 'гарантия'];
  }

  private generateLongTailKeywords(content: string): string[] {
    return ['как заказать услуги', 'лучшие предложения', 'профессиональная помощь'];
  }

  async analyzeCompetitors(urls: string[]): Promise<{
    commonKeywords: string[];
    titlePatterns: string[];
    descriptionPatterns: string[];
    recommendations: string[];
  }> {
    // Анализ конкурентов (заглушка)
    return {
      commonKeywords: ['seo', 'оптимизация', 'продвижение'],
      titlePatterns: ['Ключевое слово | Бренд', 'Ключевое слово - описание'],
      descriptionPatterns: ['Описание + призыв к действию', 'Выгоды + контакты'],
      recommendations: [
        'Используйте более длинные заголовки',
        'Добавьте эмоциональные триггеры в описания',
        'Включите больше местных ключевых слов'
      ]
    };
  }
}

export const aiOptimizationService = new AiOptimizationService();
