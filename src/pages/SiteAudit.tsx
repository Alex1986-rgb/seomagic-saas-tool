import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import { AuditProvider } from '@/contexts/AuditContext';
import AuditResultsContainer from '@/components/audit/results/AuditResultsContainer';
import { AuditWorkspace } from '@/components/audit/AuditWorkspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SiteAudit: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("SiteAudit page rendering with params:", searchParams.toString());

  useEffect(() => {
    const urlParam = searchParams.get('url');
    const taskIdParam = searchParams.get('task_id');
    
    console.log("URL Param:", urlParam);
    
    if (urlParam) {
      try {
        // Validate URL format
        const formattedUrl = urlParam.startsWith('http') ? urlParam : `https://${urlParam}`;
        new URL(formattedUrl);
        setUrl(urlParam);
        setInputUrl(urlParam);
        setError(null);
        
        // If task_id is present, store it in localStorage for this url
        if (taskIdParam) {
          localStorage.setItem(`task_id_${urlParam}`, taskIdParam);
          console.log('[SITE AUDIT] Task ID saved to localStorage:', taskIdParam);
        } else {
          // If no task_id in URL, check localStorage for recovery
          const savedTaskId = localStorage.getItem(`task_id_${urlParam}`);
          if (savedTaskId) {
            console.log('[SITE AUDIT] 🔄 Recovering task_id from localStorage:', savedTaskId);
            navigate(`/site-audit?url=${encodeURIComponent(urlParam)}&task_id=${savedTaskId}`, { replace: true });
            return; // Exit early, will re-run with task_id
          }
        }
      } catch (err) {
        console.error("Invalid URL provided:", urlParam, err);
        setError("Предоставленный URL некорректен. Пожалуйста, попробуйте снова.");
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
        setUrl('example.com');
        setInputUrl('example.com');
      }
    } else {
      // Use a demo URL if no URL is provided
      console.log("No URL provided, using demo URL");
      setUrl('example.com');
      setInputUrl('example.com');
    }
    
    // Finish loading in any case
    setIsLoading(false);
  }, [searchParams, toast, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputUrl.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    // Format URL if needed
    let formattedUrl = inputUrl;
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      formattedUrl = inputUrl.replace(/^www\./, '');
    }
    
    // Navigate to the same page with a new URL parameter
    navigate(`/site-audit?url=${encodeURIComponent(formattedUrl)}`);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Check if this is a dynamic page with task_id
  const taskId = searchParams.get('task_id');
  const robotsContent = taskId ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

  return (
    <Layout>
      <Helmet>
        <title>SEO Аудит Сайта | SeoMarket</title>
        <meta name="description" content="Проведите полный SEO аудит вашего сайта. Анализ технических параметров, контента, производительности и получите рекомендации по оптимизации." />
        <meta name="robots" content={robotsContent} />
        <link rel="canonical" href="https://seomarket.app/site-audit" />
      </Helmet>
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">SEO Аудит сайта</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Полный анализ и рекомендации по оптимизации вашего сайта
          </p>
          
          <Card className="mb-8 bg-card/90 backdrop-blur-sm border border-primary/10">
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Введите URL сайта (например, example.com)"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className={`pr-10 ${!isValidUrl(inputUrl) && inputUrl ? 'border-destructive' : ''}`}
                  />
                  {inputUrl && isValidUrl(inputUrl) && (
                    <a 
                      href={inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <Button type="submit" className="whitespace-nowrap" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Аудит сайта
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          ) : url && isValidUrl(url) && (
            <AuditProvider initialUrl={url}>
              <AuditWorkspace url={url}>
                <AuditResultsContainer url={url} />
              </AuditWorkspace>
            </AuditProvider>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default SiteAudit;
