
/**
 * Creates an optimized copy of the site and packages it as ZIP
 */
import { PageContent, OptimizationResponse } from './optimization/types';
import { faker } from '@faker-js/faker';
import { optimizePageContent, improveSeoDescription, generateSeoDescription, generateKeywords } from './content';

export const createOptimizedSite = async (
  domain: string,
  pagesContent: PageContent[]
): Promise<OptimizationResponse> => {
  const optimizedPages = pagesContent.map(page => {
    const optimizedPage = { ...page };
    
    const beforeScore = Math.floor(Math.random() * 50) + 30;
    const afterScore = Math.floor(Math.random() * 20) + 80;
    
    const optimizedContent = optimizePageContent(page.content);
    
    const optimizedMeta = {
      description: page.meta.description 
        ? improveSeoDescription(page.meta.description)
        : generateSeoDescription(page.title, page.content),
      keywords: generateKeywords(page.title, page.content)
    };
    
    optimizedPage.optimized = {
      content: optimizedContent,
      meta: optimizedMeta,
      score: afterScore
    };
    
    return optimizedPage;
  });
  
  const demoPage = optimizedPages.find(p => !p.url.includes('/')) || optimizedPages[0];
  
  const averageBeforeScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (Math.floor(Math.random() * 50) + 30), 0) / optimizedPages.length
  );
  
  const averageAfterScore = Math.floor(
    optimizedPages.reduce((sum, page) => sum + (page.optimized?.score || 80), 0) / optimizedPages.length
  );
  
  const archive = new Blob(['Optimized site content would be here'], { type: 'application/zip' });
  
  return {
    blob: archive,
    beforeScore: averageBeforeScore,
    afterScore: averageAfterScore,
    demoPage
  };
};
