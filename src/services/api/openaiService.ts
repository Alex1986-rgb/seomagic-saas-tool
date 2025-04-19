
import axios from 'axios';
import { PageData } from './crawlerService';

export interface OptimizationOptions {
  optimizeMetaTags: boolean;
  optimizeHeadings: boolean;
  optimizeContent: boolean;
  optimizeImages: boolean; // Added this property to fix the type error
  language: string;
  prompt?: string;
  temperature?: number;
  model?: string;
}

interface OptimizationResult {
  title: string | null;
  metaTags: {
    description: string | null;
    keywords: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  optimizedHtml: string | null;
  suggestions: string[];
}

class OpenAIService {
  private apiKey: string | null = null;
  
  /**
   * Set the OpenAI API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }
  
  /**
   * Get the OpenAI API key
   */
  getApiKey(): string | null {
    return this.apiKey;
  }
  
  /**
   * Optimize a page using OpenAI
   */
  async optimizePage(
    pageData: PageData, 
    options: OptimizationOptions
  ): Promise<OptimizationResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }
    
    try {
      // Create a concise version of the page data to reduce token usage
      const pageContext = {
        url: pageData.url,
        title: pageData.title,
        metaTags: pageData.metaTags,
        headings: pageData.headings,
        content: pageData.content.substring(0, 2000), // Limit content length
        links: {
          internal: pageData.links.internal.length,
          external: pageData.links.external.length
        },
        issues: pageData.issues
      };
      
      // Create the optimization prompt
      const systemPrompt = this.createSystemPrompt(options);
      const userPrompt = this.createUserPrompt(pageContext, options);
      
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse the response
      const content = response.data.choices[0].message.content;
      
      return this.parseOptimizationResponse(content, pageData);
    } catch (error) {
      console.error('Error optimizing page with OpenAI:', error);
      
      // Return empty optimization result
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
  
  /**
   * Create a system prompt for OpenAI based on the optimization options
   */
  private createSystemPrompt(options: OptimizationOptions): string {
    const language = options.language || 'en';
    
    let prompt = `You are an expert SEO content optimizer. Your task is to optimize website content for better search engine rankings while maintaining readability and user engagement.

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
  
  /**
   * Create a user prompt for OpenAI based on the page context
   */
  private createUserPrompt(pageContext: any, options: OptimizationOptions): string {
    let prompt = `Please optimize the following web page for better SEO:

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
    
    return prompt;
  }
  
  /**
   * Parse the optimization response from OpenAI
   */
  private parseOptimizationResponse(
    content: string, 
    originalPage: PageData
  ): OptimizationResult {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const json = JSON.parse(jsonMatch[0]);
      
      // Apply the optimizations to the original HTML
      const optimizedHtml = this.applyOptimizationsToHtml(
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
  
  /**
   * Apply optimizations to HTML content
   */
  private applyOptimizationsToHtml(
    html: string,
    optimizations: any
  ): string {
    try {
      let optimizedHtml = html;
      
      // Replace title
      if (optimizations.title) {
        optimizedHtml = optimizedHtml.replace(
          /<title>.*?<\/title>/i,
          `<title>${optimizations.title}</title>`
        );
      }
      
      // Replace meta description
      if (optimizations.metaDescription) {
        if (optimizedHtml.includes('<meta name="description"')) {
          optimizedHtml = optimizedHtml.replace(
            /<meta name="description".*?>/i,
            `<meta name="description" content="${optimizations.metaDescription}">`
          );
        } else {
          optimizedHtml = optimizedHtml.replace(
            /<head>([\s\S]*?)<\/head>/i,
            `<head>$1<meta name="description" content="${optimizations.metaDescription}">\n</head>`
          );
        }
      }
      
      // Replace meta keywords
      if (optimizations.keywords) {
        if (optimizedHtml.includes('<meta name="keywords"')) {
          optimizedHtml = optimizedHtml.replace(
            /<meta name="keywords".*?>/i,
            `<meta name="keywords" content="${optimizations.keywords}">`
          );
        } else {
          optimizedHtml = optimizedHtml.replace(
            /<head>([\s\S]*?)<\/head>/i,
            `<head>$1<meta name="keywords" content="${optimizations.keywords}">\n</head>`
          );
        }
      }
      
      // Replace H1
      if (optimizations.h1) {
        const h1Count = (optimizedHtml.match(/<h1/g) || []).length;
        
        if (h1Count === 1) {
          optimizedHtml = optimizedHtml.replace(
            /<h1.*?>([\s\S]*?)<\/h1>/i,
            `<h1>${optimizations.h1}</h1>`
          );
        } else if (h1Count === 0) {
          optimizedHtml = optimizedHtml.replace(
            /<body>([\s\S]*?)/i,
            `<body>\n<h1>${optimizations.h1}</h1>$1`
          );
        }
      }
      
      return optimizedHtml;
    } catch (error) {
      console.error('Error applying optimizations to HTML:', error);
      return html;
    }
  }
}

export const openaiService = new OpenAIService();
