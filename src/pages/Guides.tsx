import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import GuideCard from '@/components/guides/GuideCard';
import { guides } from '@/data/guidesData';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const Guides: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let result = [...guides];
    
    if (activeTab !== 'all') {
      const levelMap = {
        'beginner': 'Начинающий',
        'intermediate': 'Средний',
        'advanced': 'Продвинутый'
      };
      
      result = result.filter(guide => guide.level === levelMap[activeTab]);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(guide => 
        guide.title.toLowerCase().includes(query) || 
        guide.description.toLowerCase().includes(query) || 
        guide.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredGuides(result);
  }, [activeTab, searchQuery]);

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Руководства', url: '/guides' }
      ]} />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Руководства и инструкции</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Подробные руководства для эффективного использования всех возможностей платформы
            </p>
          </motion.div>
          
          <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-auto order-2 md:order-1">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-wrap">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="beginner">Для начинающих</TabsTrigger>
                  <TabsTrigger value="intermediate">Средний уровень</TabsTrigger>
                  <TabsTrigger value="advanced">Продвинутый</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="w-full md:w-1/3 order-1 md:order-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск руководств..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2 order-3">
              <Filter className="h-4 w-4" />
              <span>Фильтры</span>
            </Button>
          </div>
          
          {filteredGuides.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-40 mb-4" />
              <h3 className="text-xl font-medium mb-2">Руководства не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска или фильтрации</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <GuideCard key={guide.id} guide={guide} index={index} />
              ))}
            </div>
          )}
          
          {filteredGuides.length > 0 && filteredGuides.length < guides.length && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Показать все руководства
              </Button>
            </div>
          )}
          
          {activeTab === 'all' && searchQuery === '' && filteredGuides.length === guides.length && (
            <div className="mt-16 text-center">
              <Button variant="outline" size="lg">
                Загрузить больше руководств
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Guides;
