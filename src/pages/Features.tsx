
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getFeaturesByCategory } from '@/components/features/featuresData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import FeatureGrid from '@/components/features/FeatureGrid';

const Features: React.FC = () => {
  const categorizedFeatures = getFeaturesByCategory();
  const categories = Object.keys(categorizedFeatures);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Функция для фильтрации функций по поисковому запросу
  const filterFeatures = () => {
    if (activeCategory === 'all' && !searchQuery) {
      // Возвращаем все функции
      return Object.values(categorizedFeatures).flat().map(feature => {
        const Icon = feature.icon;
        return {
          icon: <Icon className="w-6 h-6 text-primary" />,
          title: feature.title,
          description: feature.description,
          link: feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
        };
      });
    } else if (activeCategory !== 'all' && !searchQuery) {
      // Возвращаем функции только выбранной категории
      return categorizedFeatures[activeCategory].map(feature => {
        const Icon = feature.icon;
        return {
          icon: <Icon className="w-6 h-6 text-primary" />,
          title: feature.title,
          description: feature.description,
          link: feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
        };
      });
    } else {
      // Фильтруем функции по поисковому запросу
      let featuresToSearch = activeCategory === 'all' 
        ? Object.values(categorizedFeatures).flat()
        : categorizedFeatures[activeCategory];
      
      return featuresToSearch
        .filter(feature => 
          feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feature.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(feature => {
          const Icon = feature.icon;
          return {
            icon: <Icon className="w-6 h-6 text-primary" />,
            title: feature.title,
            description: feature.description,
            link: feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
          };
        });
    }
  };
  
  const filteredFeatures = filterFeatures();

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Заголовок страницы */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">Возможности платформы</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Полный список функций для SEO-аудита, оптимизации и мониторинга вашего сайта
        </p>
      </motion.div>
      
      {/* Поиск по функциям */}
      <motion.div 
        className="max-w-md mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Input
            placeholder="Поиск функций..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1.5 h-7 w-7 p-0"
              onClick={() => setSearchQuery('')}
            >
              ×
            </Button>
          )}
        </div>
      </motion.div>
      
      {/* Табы с категориями */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8 flex flex-wrap justify-center">
            <TabsTrigger value="all">Все функции</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="focus-visible:outline-none">
            {filteredFeatures.length > 0 ? (
              <FeatureGrid features={filteredFeatures} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">По вашему запросу ничего не найдено</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }} 
                  className="mt-4"
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Features;
