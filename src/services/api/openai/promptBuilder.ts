
import { OptimizationOptions } from './types';

export class PromptBuilder {
  static createSystemPrompt(options: OptimizationOptions): string {
    const language = options.language || 'en';
    const quality = options.contentQuality || 'premium';
    
    let qualityPrompt = '';
    switch (quality) {
      case 'standard':
        qualityPrompt = 'Provide practical optimization focusing on essential SEO elements.';
        break;
      case 'premium':
        qualityPrompt = 'Provide detailed optimization with a balance of SEO effectiveness and high-quality content.';
        break;
      case 'ultimate':
        qualityPrompt = 'Provide expert-level comprehensive optimization with perfect SEO, excellent readability, and fully detailed information.';
        break;
      default:
        qualityPrompt = 'Provide detailed optimization with a balance of SEO effectiveness and high-quality content.';
    }
    
    let prompt = `You are an expert SEO content optimizer. Your task is to optimize website content for better search engine rankings while maintaining readability and user engagement. ${qualityPrompt}

Please respond in ${language} language.

For the provided page, you should:`;
    
    if (options.optimizeMetaTags) {
      prompt += `
- Create an optimized page title (50-60 characters)
- Create an optimized meta description (150-160 characters)
- Suggest relevant keywords for the page`;
    }
    
    if (options.optimizeHeadings) {
      prompt += `
- Suggest optimized H1 heading (include one primary keyword)
- Suggest optimized H2 and H3 headings (include secondary keywords)`;
    }
    
    if (options.optimizeContent) {
      prompt += `
- Provide optimization suggestions for the content
- Fix any grammatical or spelling errors
- Suggest improvements to make the content more engaging`;
    }
    
    if (options.prompt) {
      prompt += `\n\nAdditional instructions: ${options.prompt}`;
    }
    
    return prompt;
  }

  static createUserPrompt(pageContext: any): string {
    return `Please optimize the following web page for better SEO:

URL: ${pageContext.url}

Current Title: ${pageContext.title || 'No title'}

Current Meta Description: ${pageContext.metaTags.description || 'No meta description'}

Current Meta Keywords: ${pageContext.metaTags.keywords || 'No meta keywords'}

Current H1 Headings: ${pageContext.headings.h1.join(' | ') || 'No H1 headings'}

Current H2 Headings: ${pageContext.headings.h2.join(' | ') || 'No H2 headings'}

Page Content Sample:
${pageContext.content}

SEO Issues:
${[
  ...pageContext.issues.critical.map((issue: string) => `CRITICAL: ${issue}`),
  ...pageContext.issues.important.map((issue: string) => `IMPORTANT: ${issue}`),
  ...pageContext.issues.opportunities.map((issue: string) => `OPPORTUNITY: ${issue}`)
].join('\n')}

Please provide your optimization suggestions in the following JSON format:
{
  "title": "Optimized Page Title",
  "metaDescription": "Optimized meta description that encourages clicks and includes relevant keywords.",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "h1": "Optimized H1 Heading",
  "h2": ["Optimized H2 Heading 1", "Optimized H2 Heading 2"],
  "h3": ["Optimized H3 Heading 1", "Optimized H3 Heading 2"],
  "contentSuggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ]
}`;
  }
  
  static createHtmlFixPrompt(html: string, errors: string[]): string {
    return `Please fix the following errors in this HTML:
${errors.join('\n')}

HTML:
${html}

Please return only the fixed HTML code.`;
  }
  
  static createContentImprovePrompt(content: string, keywords: string[] = [], quality: string = 'premium'): string {
    let qualityPrompt = '';
    
    switch (quality) {
      case 'standard':
        qualityPrompt = 'Make SEO-focused improvements while keeping the content concise.';
        break;
      case 'premium':
        qualityPrompt = 'Make comprehensive improvements with a balance of SEO and user experience, adding details where appropriate.';
        break;
      case 'ultimate':
        qualityPrompt = 'Make expert-level improvements with perfect SEO, excellent readability, and fully detailed information.';
        break;
      default:
        qualityPrompt = 'Make comprehensive improvements with a balance of SEO and user experience.';
    }
    
    return `Please improve this content. ${qualityPrompt} ${keywords.length > 0 ? 'Focus on these keywords: ' + keywords.join(', ') : ''}
    
Content:
${content}

Please return the improved content only.`;
  }
}
