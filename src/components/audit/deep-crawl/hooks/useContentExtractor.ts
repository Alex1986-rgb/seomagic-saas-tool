
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ContentExtractor, contentExtractorService } from '@/services/audit/contentExtractor/contentExtractor';
import { ExtractedSite, ExtractionOptions, ContentExtractionProgress } from '@/services/audit/contentExtractor/types';
import { saveAs } from 'file-saver';

export const useContentExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSite, setExtractedSite] = useState<ExtractedSite | null>(null);
  const [progress, setProgress] = useState<ContentExtractionProgress>({
    completed: 0,
    total: 0,
    isComplete: false
  });
  const { toast } = useToast();

  const extractContent = async (urls: string[], domain: string, options: ExtractionOptions = {}) => {
    setIsExtracting(true);
    setProgress({
      completed: 0,
      total: urls.length,
      isComplete: false
    });
    
    try {
      // Set default options if not specified
      const extractionOptions: ExtractionOptions = {
        includeHtml: true,
        includeText: true,
        includeMetaTags: true,
        includeHeadings: true,
        includeLinks: true,
        includeImages: true,
        ...options,
        onProgress: (completed, total) => {
          setProgress({
            completed,
            total,
            currentUrl: urls[completed - 1], // The URL we just completed
            isComplete: completed === total
          });
          
          // Update progress in toast
          const progressPercent = Math.round((completed / total) * 100);
          toast({
            title: "Извлечение контента",
            description: `Обработано ${completed} из ${total} страниц (${progressPercent}%)`,
            duration: 3000,
          });
          
          // Also call the user-provided onProgress if it exists
          if (options.onProgress) {
            options.onProgress(completed, total);
          }
        }
      };

      // Use the contentExtractorService to extract content
      // We'll use the extractFromUrls method and then convert the result to our ExtractedSite format
      const extractedContent = await contentExtractorService.extractFromUrls(
        urls,
        (processed, total, currentUrl) => {
          const onProgress = extractionOptions.onProgress;
          if (onProgress) {
            onProgress(processed, total);
          }
        }
      );
      
      // Convert the extracted content to our ExtractedSite format
      const site: ExtractedSite = {
        domain,
        extractedAt: new Date().toISOString(),
        pageCount: extractedContent.size,
        pages: Array.from(extractedContent.values()).map(content => ({
          url: content.url,
          title: content.title,
          content: content.text,
          html: content.html,
          meta: {
            description: content.metaTags.description || null,
            keywords: content.metaTags.keywords || null,
            author: null,
            robots: null
          },
          headings: {
            h1: content.headings.h1,
            h2: content.headings.h2,
            h3: content.headings.h3
          },
          links: {
            internal: content.links.filter(link => link.includes(domain)),
            external: content.links.filter(link => !link.includes(domain))
          },
          images: content.images.map(img => ({
            url: img.src,
            alt: img.alt || null,
            title: null
          }))
        }))
      };
      
      setExtractedSite(site);
      
      toast({
        title: "Извлечение завершено",
        description: `Успешно обработано ${site.pages.length} страниц`,
      });

      return site;
    } catch (error) {
      console.error('Error during content extraction:', error);
      toast({
        title: "Ошибка извлечения",
        description: "Произошла ошибка при извлечении контента",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsExtracting(false);
      setProgress(prev => ({ ...prev, isComplete: true }));
    }
  };

  const exportContent = async (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    if (!extractedSite) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }

    try {
      switch (format) {
        case 'json': {
          // Export to JSON manually since the service doesn't have this specific method
          const jsonBlob = new Blob([JSON.stringify(extractedSite, null, 2)], { type: 'application/json' });
          saveAs(jsonBlob, `${extractedSite.domain}-content.json`);
          break;
        }
        case 'html': {
          // Use the exportToHtml method from contentExtractorService
          const htmlContent = contentExtractorService.exportToHtml();
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          saveAs(htmlBlob, `${extractedSite.domain}-sitemap.html`);
          break;
        }
        case 'markdown': {
          // Use the exportToMarkdown method from contentExtractorService
          const markdownContent = contentExtractorService.exportToMarkdown();
          const mdBlob = new Blob([markdownContent], { type: 'text/markdown' });
          saveAs(mdBlob, `${extractedSite.domain}-sitemap.md`);
          break;
        }
        case 'sitemap': {
          // Generate sitemap XML manually
          const sitemapXml = generateSitemapXml(extractedSite);
          const xmlBlob = new Blob([sitemapXml], { type: 'text/xml' });
          saveAs(xmlBlob, `sitemap.xml`);
          break;
        }
        case 'all': {
          // Use the downloadAll method from contentExtractorService
          await contentExtractorService.downloadAll(`${extractedSite.domain}-content.zip`);
          break;
        }
      }

      toast({
        title: "Экспорт завершен",
        description: `Контент успешно экспортирован в формат ${format}`,
      });
    } catch (error) {
      console.error('Error during export:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте контента",
        variant: "destructive"
      });
    }
  };

  // Helper function to generate sitemap XML
  const generateSitemapXml = (site: ExtractedSite): string => {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const page of site.pages) {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(page.url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  };
  
  // Helper function to escape XML special characters
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  return {
    isExtracting,
    extractedSite,
    progress,
    extractContent,
    exportContent
  };
};
