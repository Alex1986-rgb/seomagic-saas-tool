
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SeoAuditResults from '@/components/SeoAuditResults';
import UrlForm from '@/components/UrlForm';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Rocket, Target } from 'lucide-react';

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
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
        
        <motion.div 
          className="mb-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-sm bg-secondary text-primary font-medium mb-4">
            {url ? <Target className="w-4 h-4 mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
            {url ? 'SEO Анализ' : 'SEO Аудит'}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            {url ? 'Результаты SEO аудита' : 'Начните SEO аудит'}
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
            className="max-w-2xl mx-auto mb-16 elegant-card p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UrlForm />
          </motion.div>
        )}

        {url && <SeoAuditResults url={url} />}
      </div>
    </Layout>
  );
};

export default Audit;
