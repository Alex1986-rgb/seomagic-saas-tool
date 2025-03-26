
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SeoAuditResults from '@/components/SeoAuditResults';
import UrlForm from '@/components/UrlForm';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Shield, Target } from 'lucide-react';

const Audit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
        // Validate URL format
        new URL(urlParam);
        setUrl(urlParam);
      } catch (err) {
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
        setUrl('');
      }
    }
  }, [searchParams, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-[url('/img/tactical-map.png')] opacity-5 bg-repeat mix-blend-overlay -z-10" />
        
        <motion.div 
          className="mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
            {url ? <Target className="w-4 h-4 mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
            {url ? 'SEO Анализ' : 'SEO Аудит'}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            {url ? 'Результаты SEO аудита' : 'Начните SEO аудит'}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"></div>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            {url 
              ? `Комплексный анализ ${url}`
              : 'Введите URL вашего сайта для получения детального SEO анализа'
            }
          </p>
        </motion.div>

        {!url && (
          <motion.div 
            className="max-w-2xl mx-auto mb-16 tanks-card p-8 border border-primary/20 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-[40px] h-[40px] border-t border-l border-primary/40 -mt-px -ml-px" />
            <div className="absolute top-0 right-0 w-[40px] h-[40px] border-t border-r border-primary/40 -mt-px -mr-px" />
            <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-b border-l border-primary/40 -mb-px -ml-px" />
            <div className="absolute bottom-0 right-0 w-[40px] h-[40px] border-b border-r border-primary/40 -mb-px -mr-px" />
            <UrlForm />
          </motion.div>
        )}

        {url && <SeoAuditResults url={url} />}
      </div>
    </Layout>
  );
};

export default Audit;
