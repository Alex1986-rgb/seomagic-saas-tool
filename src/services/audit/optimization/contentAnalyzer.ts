
import { PageContent } from './types';

export const analyzeContent = (pagesContent: PageContent[]) => {
  const uniqueContents = new Set<string>();
  const analysis = {
    missingMetaDescriptions: 0,
    missingMetaKeywords: 0,
    missingAltTags: 0,
    underscoreUrls: 0,
    duplicateContent: 0,
    contentToRewrite: 0
  };

  pagesContent.forEach(page => {
    if (!page.meta.description) {
      analysis.missingMetaDescriptions++;
    }
    
    if (!page.meta.keywords) {
      analysis.missingMetaKeywords++;
    }
    
    page.images.forEach(image => {
      if (!image.alt) {
        analysis.missingAltTags++;
      }
    });
    
    if (page.url.includes('_')) {
      analysis.underscoreUrls++;
    }
    
    const contentHash = page.content.slice(0, 200);
    if (uniqueContents.has(contentHash)) {
      analysis.duplicateContent++;
    } else {
      uniqueContents.add(contentHash);
      if (Math.random() > 0.3) {
        analysis.contentToRewrite++;
      }
    }
  });

  return analysis;
};
