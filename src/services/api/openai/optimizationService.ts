import { PageData } from '../crawlerService';
import { OptimizationOptions, OptimizationResult } from './types';
import { openAIApiClient } from './apiClient';
import { PromptBuilder } from './promptBuilder';
import { HtmlOptimizer } from './htmlOptimizer';

class OptimizationService {
  async optimizePage(pageData: PageData, options: OptimizationOptions): Promise<OptimizationResult> {
    try {
      const pageContext = {
        url: pageData.url,
        title: pageData.title,
        metaTags: pageData.metaTags,
        headings: pageData.headings,
        content: pageData.content.substring(0, 2000),
        links: {
          internal: pageData.links.internal.length,
          external: pageData.links.external.length
        },
        issues: pageData.issues
      };
      
      const systemPrompt = PromptBuilder.createSystemPrompt(options);
      const userPrompt = PromptBuilder.createUserPrompt(pageContext);
      
      const content = await openAIApiClient.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
      
      return this.parseOptimizationResponse(content, pageData);
    } catch (error) {
      console.error('Error optimizing page with OpenAI:', error);
      
      return {
        title: pageData.title,
        metaTags: {
          description: pageData.metaTags.description,
          keywords: pageData.metaTags.keywords
        },
        headings: {
          h1: pageData.headings.h1,
          h2: pageData.headings.h2,
          h3: pageData.headings.h3
        },
        optimizedHtml: null,
        suggestions: ['Error optimizing page with OpenAI']
      };
    }
  }
  
  private parseOptimizationResponse(content: string, originalPage: PageData): OptimizationResult {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const json = JSON.parse(jsonMatch[0]);
      
      const optimizedHtml = HtmlOptimizer.applyOptimizations(
        originalPage.html,
        json
      );
      
      return {
        title: json.title || originalPage.title,
        metaTags: {
          description: json.metaDescription || originalPage.metaTags.description,
          keywords: json.keywords || originalPage.metaTags.keywords
        },
        headings: {
          h1: json.h1 ? [json.h1] : originalPage.headings.h1,
          h2: json.h2 || originalPage.headings.h2,
          h3: json.h3 || originalPage.headings.h3
        },
        optimizedHtml,
        suggestions: json.contentSuggestions || []
      };
    } catch (error) {
      console.error('Error parsing optimization response:', error);
      
      return {
        title: originalPage.title,
        metaTags: {
          description: originalPage.metaTags.description,
          keywords: originalPage.metaTags.keywords
        },
        headings: {
          h1: originalPage.headings.h1,
          h2: originalPage.headings.h2,
          h3: originalPage.headings.h3
        },
        optimizedHtml: null,
        suggestions: ['Error parsing optimization response']
      };
    }
  }
}

export const optimizationService = new OptimizationService();
