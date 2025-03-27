
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function useSimpleSitemapCreator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const generateSitemap = async (url: string): Promise<void> => {
    setIsGenerating(true);
    setProgress(0);
    setSitemap(null);
    setUrls([]);

    try {
      // Нормализуем URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const domain = new URL(normalizedUrl).hostname;
      
      // Имитируем процесс сканирования (в реальном приложении здесь был бы настоящий crawler)
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i * 10);
      }
      
      // Генерируем список URL-ов для демонстрации
      const sampleUrls = generateSampleUrls(normalizedUrl, domain);
      setUrls(sampleUrls);
      
      // Создаем sitemap.xml
      const generatedSitemap = generateSitemapXml(domain, sampleUrls);
      setSitemap(generatedSitemap);
      
      toast({
        title: "Карта сайта создана",
        description: `Обнаружено ${sampleUrls.length} URL-адресов на сайте ${domain}`,
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать карту сайта",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'text/xml' });
    saveAs(blob, `sitemap.xml`);
    
    toast({
      title: "Файл загружен",
      description: "Sitemap.xml успешно скачан",
    });
  };

  const downloadCsv = () => {
    if (urls.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," + urls.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "urls.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Файл загружен",
      description: "CSV с URL-адресами успешно скачан",
    });
  };

  const downloadAllData = async () => {
    if (urls.length === 0 || !sitemap) return;
    
    const zip = new JSZip();
    zip.file("sitemap.xml", sitemap);
    zip.file("urls.csv", urls.join("\n"));
    zip.file("metadata.json", JSON.stringify({
      generatedAt: new Date().toISOString(),
      urlCount: urls.length,
      domain: urls[0] ? new URL(urls[0]).hostname : 'unknown'
    }, null, 2));
    
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "sitemap-data.zip");
    
    toast({
      title: "Архив загружен",
      description: "Все данные успешно скачаны в архиве",
    });
  };

  return {
    isGenerating,
    progress,
    sitemap,
    urls,
    generateSitemap,
    downloadSitemap,
    downloadCsv,
    downloadAllData
  };
}

// Вспомогательные функции
function generateSampleUrls(baseUrl: string, domain: string): string[] {
  const urls: string[] = [];
  
  // Добавляем главную страницу
  urls.push(baseUrl);
  
  // Генерируем образцы URL для различных разделов
  const sections = ['about', 'products', 'services', 'blog', 'contact'];
  sections.forEach(section => {
    urls.push(`${baseUrl}/${section}`);
    
    // Для некоторых разделов добавляем подстраницы
    if (section === 'blog' || section === 'products') {
      for (let i = 1; i <= 20; i++) {
        urls.push(`${baseUrl}/${section}/${section}-item-${i}`);
      }
    }
  });
  
  // Добавляем несколько страниц категорий
  const categories = ['category-1', 'category-2', 'category-3'];
  categories.forEach(category => {
    urls.push(`${baseUrl}/catalog/${category}`);
    
    // И продукты внутри категорий
    for (let i = 1; i <= 10; i++) {
      urls.push(`${baseUrl}/catalog/${category}/product-${i}`);
    }
  });
  
  return urls;
}

function generateSitemapXml(domain: string, urls: string[]): string {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
  });
  
  sitemap += '</urlset>';
  return sitemap;
}
