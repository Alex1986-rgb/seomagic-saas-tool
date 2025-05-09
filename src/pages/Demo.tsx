
import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { 
  Play, Laptop, BarChart2, PenTool, 
  Eye, ArrowRight, Download, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DemoServiceProcess from '@/components/demo/DemoServiceProcess';
import DemoUserGuide from '@/components/demo/DemoUserGuide';
import DemoFeatures from '@/components/demo/DemoFeatures';
import DemoInteractiveExample from '@/components/demo/DemoInteractiveExample';

const Demo: React.FC = () => {
  return (
    <Layout>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background/90 -z-10" />
        {/* Replace the problematic background with a gradient */}
        <div className="absolute inset-0 bg-opacity-5 mix-blend-overlay -z-5" />
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
              <Laptop className="w-4 h-4 mr-2" />
              Интерактивная демонстрация
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
              <span className="inline-block relative">
                Попробуйте SeoMarket в действии
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Ознакомьтесь с работой платформы, интерактивными примерами и пошаговым руководством пользователя
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Play className="w-4 h-4" /> Посмотреть видеодемонстрацию
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="w-4 h-4" /> Скачать руководство пользователя
              </Button>
            </div>
          </motion.div>
          
          <Tabs defaultValue="process" className="mt-16">
            <TabsList className="grid grid-cols-4 max-w-3xl mx-auto mb-8">
              <TabsTrigger value="process" className="data-[state=active]:text-primary">
                <BarChart2 className="w-4 h-4 mr-2" /> Процесс работы
              </TabsTrigger>
              <TabsTrigger value="guide" className="data-[state=active]:text-primary">
                <PenTool className="w-4 h-4 mr-2" /> Руководство
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:text-primary">
                <CheckCircle className="w-4 h-4 mr-2" /> Функции
              </TabsTrigger>
              <TabsTrigger value="interactive" className="data-[state=active]:text-primary">
                <Eye className="w-4 h-4 mr-2" /> Примеры
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="process" className="mt-6">
              <DemoServiceProcess />
            </TabsContent>
            
            <TabsContent value="guide" className="mt-6">
              <DemoUserGuide />
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <DemoFeatures />
            </TabsContent>
            
            <TabsContent value="interactive" className="mt-6">
              <DemoInteractiveExample />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Demo;
