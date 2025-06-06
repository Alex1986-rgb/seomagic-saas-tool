
export interface SeoOptimizationRules {
  keywordDensity: {
    min: number;
    max: number;
    optimal: number;
  };
  titleLength: {
    min: number;
    max: number;
    optimal: number;
  };
  descriptionLength: {
    min: number;
    max: number;
    optimal: number;
  };
  headingStructure: {
    h1Count: number;
    h2MinCount: number;
    h3MaxPerH2: number;
  };
  contentRequirements: {
    minWordCount: number;
    paragraphMaxWords: number;
    listsRequired: boolean;
    internalLinksMin: number;
    externalLinksMax: number;
  };
}

export interface KeywordAnalysis {
  type: 'ВЧ' | 'СЧ' | 'НЧ';
  frequency: number;
  competition: 'высокая' | 'средняя' | 'низкая';
  difficulty: number;
  searchVolume: number;
  lsiKeywords: string[];
}

export interface ContentStructureAnalysis {
  headingStructure: {
    h1: string[];
    h2: string[];
    h3: string[];
    isCorrectHierarchy: boolean;
  };
  paragraphs: {
    count: number;
    averageWords: number;
    readabilityScore: number;
  };
  lists: {
    bulleted: number;
    numbered: number;
  };
  links: {
    internal: number;
    external: number;
  };
}

export interface SeoOptimizationResult {
  keywords: {
    primary: KeywordAnalysis[];
    secondary: KeywordAnalysis[];
    lsi: string[];
    density: number;
    distribution: {
      title: boolean;
      h1: boolean;
      h2: boolean;
      firstParagraph: boolean;
      body: boolean;
      meta: boolean;
    };
  };
  structure: ContentStructureAnalysis;
  metadata: {
    title: {
      current: string;
      optimized: string;
      length: number;
      hasKeyword: boolean;
      hasUtp: boolean;
    };
    description: {
      current: string;
      optimized: string;
      length: number;
      hasKeyword: boolean;
      hasCta: boolean;
    };
    slug: {
      current: string;
      optimized: string;
      hasKeyword: boolean;
    };
  };
  usability: {
    mobileOptimized: boolean;
    readabilityScore: number;
    loadingSpeed: number;
    imageOptimization: number;
  };
  uniqueness: {
    score: number;
    duplicateContent: string[];
    originalityCheck: boolean;
  };
  recommendations: {
    priority: 'высокий' | 'средний' | 'низкий';
    category: string;
    description: string;
    implementation: string;
  }[];
  overallScore: number;
}

class AdvancedSeoService {
  private rules: SeoOptimizationRules = {
    keywordDensity: { min: 0.5, max: 2.5, optimal: 1.5 },
    titleLength: { min: 30, max: 60, optimal: 55 },
    descriptionLength: { min: 120, max: 160, optimal: 155 },
    headingStructure: { h1Count: 1, h2MinCount: 2, h3MaxPerH2: 3 },
    contentRequirements: {
      minWordCount: 300,
      paragraphMaxWords: 150,
      listsRequired: true,
      internalLinksMin: 2,
      externalLinksMax: 3
    }
  };

  async analyzeContent(content: string, targetKeywords: string[]): Promise<SeoOptimizationResult> {
    console.log('Анализ контента по правилам SEO оптимизации...');
    
    const keywordAnalysis = this.analyzeKeywords(content, targetKeywords);
    const structureAnalysis = this.analyzeContentStructure(content);
    const metadataAnalysis = this.analyzeMetadata(content, targetKeywords);
    const usabilityAnalysis = this.analyzeUsability(content);
    const uniquenessAnalysis = this.analyzeUniqueness(content);
    const recommendations = this.generateRecommendations(
      keywordAnalysis,
      structureAnalysis,
      metadataAnalysis,
      usabilityAnalysis,
      uniquenessAnalysis
    );

    const overallScore = this.calculateOverallScore({
      keywordAnalysis,
      structureAnalysis,
      metadataAnalysis,
      usabilityAnalysis,
      uniquenessAnalysis
    });

    return {
      keywords: keywordAnalysis,
      structure: structureAnalysis,
      metadata: metadataAnalysis,
      usability: usabilityAnalysis,
      uniqueness: uniquenessAnalysis,
      recommendations,
      overallScore
    };
  }

  private analyzeKeywords(content: string, targetKeywords: string[]) {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Анализ основных ключевых слов
    const primary = targetKeywords.slice(0, 3).map(keyword => ({
      type: this.determineKeywordType(keyword),
      frequency: this.calculateKeywordFrequency(content, keyword),
      competition: this.analyzeCompetition(keyword),
      difficulty: this.calculateDifficulty(keyword),
      searchVolume: this.estimateSearchVolume(keyword),
      lsiKeywords: this.generateLsiKeywords(keyword)
    })) as KeywordAnalysis[];

    // Анализ вторичных ключевых слов
    const secondary = targetKeywords.slice(3, 8).map(keyword => ({
      type: this.determineKeywordType(keyword),
      frequency: this.calculateKeywordFrequency(content, keyword),
      competition: this.analyzeCompetition(keyword),
      difficulty: this.calculateDifficulty(keyword),
      searchVolume: this.estimateSearchVolume(keyword),
      lsiKeywords: this.generateLsiKeywords(keyword)
    })) as KeywordAnalysis[];

    // LSI ключевые слова
    const lsi = this.extractLsiKeywords(content, targetKeywords);
    
    // Плотность ключевых слов
    const density = this.calculateOverallDensity(content, targetKeywords);
    
    // Распределение ключевых слов
    const distribution = this.analyzeKeywordDistribution(content, targetKeywords);

    return { primary, secondary, lsi, density, distribution };
  }

  private analyzeContentStructure(content: string): ContentStructureAnalysis {
    const h1Matches = content.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
    
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const avgWordsPerParagraph = paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / paragraphs.length;
    
    const bulletedLists = (content.match(/<ul[^>]*>/gi) || []).length;
    const numberedLists = (content.match(/<ol[^>]*>/gi) || []).length;
    
    const internalLinks = (content.match(/<a[^>]*href="\/[^"]*"/gi) || []).length;
    const externalLinks = (content.match(/<a[^>]*href="https?:\/\/[^"]*"/gi) || []).length;

    return {
      headingStructure: {
        h1: h1Matches.map(h => h.replace(/<[^>]*>/g, '')),
        h2: h2Matches.map(h => h.replace(/<[^>]*>/g, '')),
        h3: h3Matches.map(h => h.replace(/<[^>]*>/g, '')),
        isCorrectHierarchy: h1Matches.length === 1 && h2Matches.length >= 2
      },
      paragraphs: {
        count: paragraphs.length,
        averageWords: Math.round(avgWordsPerParagraph),
        readabilityScore: this.calculateReadabilityScore(content)
      },
      lists: {
        bulleted: bulletedLists,
        numbered: numberedLists
      },
      links: {
        internal: internalLinks,
        external: externalLinks
      }
    };
  }

  private analyzeMetadata(content: string, keywords: string[]) {
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    
    const currentTitle = titleMatch ? titleMatch[1] : '';
    const currentDesc = descMatch ? descMatch[1] : '';
    
    return {
      title: {
        current: currentTitle,
        optimized: this.optimizeTitle(currentTitle, keywords),
        length: currentTitle.length,
        hasKeyword: keywords.some(k => currentTitle.toLowerCase().includes(k.toLowerCase())),
        hasUtp: this.hasUniqueSellingProposition(currentTitle)
      },
      description: {
        current: currentDesc,
        optimized: this.optimizeDescription(currentDesc, keywords),
        length: currentDesc.length,
        hasKeyword: keywords.some(k => currentDesc.toLowerCase().includes(k.toLowerCase())),
        hasCta: this.hasCallToAction(currentDesc)
      },
      slug: {
        current: '/current-page',
        optimized: this.optimizeSlug(keywords[0] || 'page'),
        hasKeyword: true
      }
    };
  }

  private analyzeUsability(content: string) {
    return {
      mobileOptimized: this.checkMobileOptimization(content),
      readabilityScore: this.calculateReadabilityScore(content),
      loadingSpeed: this.estimateLoadingSpeed(content),
      imageOptimization: this.checkImageOptimization(content)
    };
  }

  private analyzeUniqueness(content: string) {
    return {
      score: Math.floor(Math.random() * 10) + 90, // Mock: 90-100%
      duplicateContent: [],
      originalityCheck: true
    };
  }

  private generateRecommendations(
    keywords: any,
    structure: any,
    metadata: any,
    usability: any,
    uniqueness: any
  ) {
    const recommendations = [];

    // Рекомендации по ключевым словам
    if (keywords.density < this.rules.keywordDensity.min) {
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Ключевые слова',
        description: 'Плотность ключевых слов слишком низкая',
        implementation: 'Добавьте больше вхождений ключевых слов в текст, соблюдая естественность'
      });
    }

    // Рекомендации по структуре
    if (structure.headingStructure.h1.length !== 1) {
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Структура',
        description: 'Неправильное количество H1 заголовков',
        implementation: 'Используйте только один H1 заголовок на странице'
      });
    }

    // Рекомендации по мета-данным
    if (metadata.title.length > this.rules.titleLength.max) {
      recommendations.push({
        priority: 'средний' as const,
        category: 'Мета-данные',
        description: 'Заголовок слишком длинный',
        implementation: `Сократите заголовок до ${this.rules.titleLength.max} символов`
      });
    }

    return recommendations;
  }

  private calculateOverallScore(analyses: any): number {
    let score = 0;
    let factors = 0;

    // Оценка ключевых слов (30%)
    if (analyses.keywordAnalysis.density >= this.rules.keywordDensity.min && 
        analyses.keywordAnalysis.density <= this.rules.keywordDensity.max) {
      score += 30;
    } else {
      score += 15;
    }
    factors += 30;

    // Оценка структуры (25%)
    if (analyses.structureAnalysis.headingStructure.isCorrectHierarchy) {
      score += 25;
    } else {
      score += 10;
    }
    factors += 25;

    // Оценка мета-данных (20%)
    if (analyses.metadataAnalysis.title.hasKeyword && 
        analyses.metadataAnalysis.title.length <= this.rules.titleLength.max) {
      score += 20;
    } else {
      score += 10;
    }
    factors += 20;

    // Оценка юзабилити (15%)
    if (analyses.usabilityAnalysis.readabilityScore > 70) {
      score += 15;
    } else {
      score += 7;
    }
    factors += 15;

    // Оценка уникальности (10%)
    if (analyses.uniquenessAnalysis.score > 90) {
      score += 10;
    } else {
      score += 5;
    }
    factors += 10;

    return Math.round(score);
  }

  // Вспомогательные методы
  private determineKeywordType(keyword: string): 'ВЧ' | 'СЧ' | 'НЧ' {
    const wordCount = keyword.split(' ').length;
    if (wordCount === 1) return 'ВЧ';
    if (wordCount === 2) return 'СЧ';
    return 'НЧ';
  }

  private calculateKeywordFrequency(content: string, keyword: string): number {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = content.toLowerCase().match(regex) || [];
    return matches.length;
  }

  private analyzeCompetition(keyword: string): 'высокая' | 'средняя' | 'низкая' {
    // Mock анализ конкуренции
    const length = keyword.length;
    if (length < 10) return 'высокая';
    if (length < 20) return 'средняя';
    return 'низкая';
  }

  private calculateDifficulty(keyword: string): number {
    // Mock расчет сложности (1-100)
    return Math.floor(Math.random() * 100) + 1;
  }

  private estimateSearchVolume(keyword: string): number {
    // Mock оценка объема поиска
    return Math.floor(Math.random() * 10000) + 1000;
  }

  private generateLsiKeywords(keyword: string): string[] {
    // Mock генерация LSI ключевых слов
    return [
      `${keyword} услуги`,
      `${keyword} цена`,
      `${keyword} отзывы`,
      `как выбрать ${keyword}`,
      `лучший ${keyword}`
    ];
  }

  private extractLsiKeywords(content: string, keywords: string[]): string[] {
    // Mock извлечение LSI ключевых слов из контента
    return ['seo оптимизация', 'поисковая оптимизация', 'продвижение сайта'];
  }

  private calculateOverallDensity(content: string, keywords: string[]): number {
    const words = content.toLowerCase().split(/\s+/).length;
    const totalKeywordOccurrences = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = content.toLowerCase().match(regex) || [];
      return acc + matches.length;
    }, 0);
    
    return (totalKeywordOccurrences / words) * 100;
  }

  private analyzeKeywordDistribution(content: string, keywords: string[]) {
    return {
      title: keywords.some(k => content.includes(`<title`)),
      h1: keywords.some(k => content.includes(`<h1`)),
      h2: keywords.some(k => content.includes(`<h2`)),
      firstParagraph: true, // Mock
      body: true, // Mock
      meta: keywords.some(k => content.includes(`meta`))
    };
  }

  private calculateReadabilityScore(content: string): number {
    // Простой алгоритм оценки читаемости
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence <= 15) return 90;
    if (avgWordsPerSentence <= 20) return 75;
    if (avgWordsPerSentence <= 25) return 60;
    return 45;
  }

  private optimizeTitle(title: string, keywords: string[]): string {
    const keyword = keywords[0] || 'SEO';
    if (title.length === 0) {
      return `${keyword} - Профессиональные услуги | SeoMarket`;
    }
    
    if (!title.toLowerCase().includes(keyword.toLowerCase())) {
      return `${keyword} - ${title} | SeoMarket`;
    }
    
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }

  private optimizeDescription(description: string, keywords: string[]): string {
    const keyword = keywords[0] || 'SEO';
    if (description.length === 0) {
      return `Профессиональные услуги ${keyword}. Повысьте видимость вашего сайта в поисковых системах. ⭐ Гарантия результата ⭐ Бесплатная консультация!`;
    }
    
    if (!description.toLowerCase().includes(keyword.toLowerCase())) {
      return `${keyword}: ${description}`;
    }
    
    return description.length > 160 ? description.substring(0, 157) + '...' : description;
  }

  private optimizeSlug(keyword: string): string {
    return `/${keyword.toLowerCase().replace(/\s+/g, '-')}`;
  }

  private hasUniqueSellingProposition(title: string): boolean {
    const utpKeywords = ['лучший', 'профессиональный', 'гарантия', '№1', 'эксперт', 'качественный'];
    return utpKeywords.some(utp => title.toLowerCase().includes(utp));
  }

  private hasCallToAction(description: string): boolean {
    const ctaKeywords = ['заказать', 'получить', 'скачать', 'узнать', 'звоните', 'консультация'];
    return ctaKeywords.some(cta => description.toLowerCase().includes(cta));
  }

  private checkMobileOptimization(content: string): boolean {
    return content.includes('viewport') || content.includes('responsive');
  }

  private estimateLoadingSpeed(content: string): number {
    // Mock оценка скорости загрузки (1-100)
    const contentLength = content.length;
    if (contentLength < 10000) return 95;
    if (contentLength < 50000) return 80;
    return 60;
  }

  private checkImageOptimization(content: string): number {
    const images = content.match(/<img[^>]*>/gi) || [];
    const imagesWithAlt = content.match(/<img[^>]*alt="[^"]*"[^>]*>/gi) || [];
    
    if (images.length === 0) return 100;
    return Math.round((imagesWithAlt.length / images.length) * 100);
  }
}

export const advancedSeoService = new AdvancedSeoService();
