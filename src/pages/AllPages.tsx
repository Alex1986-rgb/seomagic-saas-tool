
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAV_ITEMS, RESOURCE_ITEMS, COMPANY_ITEMS, FEATURES_ITEMS, SUPPORT_ITEMS } from '@/components/navbar/navConstants';
import { FileText, ArrowRight } from 'lucide-react';

const AllPages: React.FC = () => {
  const navigate = useNavigate();
  
  // Combine all navigation items for display
  const allNavItems = [
    ...NAV_ITEMS,
    ...COMPANY_ITEMS,
    ...FEATURES_ITEMS, 
    ...RESOURCE_ITEMS,
    ...SUPPORT_ITEMS
  ];
  
  // Extract all child items from parent items
  const extractChildItems = () => {
    const childItems = [];
    NAV_ITEMS.forEach(item => {
      if (item.children) {
        childItems.push(...item.children);
      }
    });
    return childItems;
  };
  
  const childNavItems = extractChildItems();
  
  // Combine all unique items
  const combinedItems = [...allNavItems];
  childNavItems.forEach(child => {
    if (!combinedItems.find(item => item.href === child.href)) {
      combinedItems.push(child);
    }
  });
  
  // Remove duplicates based on href
  const uniqueItems = combinedItems.filter((item, index, self) => 
    index === self.findIndex((t) => t.href === item.href)
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Все страницы</h1>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Все страницы</TabsTrigger>
              <TabsTrigger value="main">Основные</TabsTrigger>
              <TabsTrigger value="resources">Ресурсы</TabsTrigger>
              <TabsTrigger value="company">О компании</TabsTrigger>
              <TabsTrigger value="features">Функции</TabsTrigger>
              <TabsTrigger value="support">Поддержка</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueItems.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="main" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {NAV_ITEMS.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
                {childNavItems.map((item, index) => (
                  <PageCard key={`child-${index}`} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RESOURCE_ITEMS.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMPANY_ITEMS.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURES_ITEMS.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUPPORT_ITEMS.map((item, index) => (
                  <PageCard key={index} item={item} navigate={navigate} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface PageCardProps {
  item: {
    label: string;
    href: string;
    isNew?: boolean;
    isDemo?: boolean;
    children?: Array<{label: string; href: string; isNew?: boolean; isDemo?: boolean}>;
  };
  navigate: (path: string) => void;
}

const PageCard: React.FC<PageCardProps> = ({ item, navigate }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-md">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex gap-2">
            {item.isNew && (
              <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                Новое
              </span>
            )}
            {item.isDemo && (
              <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full">
                Демо
              </span>
            )}
          </div>
        </div>
        
        <h3 className="font-medium mb-1">{item.label}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {item.href}
        </p>
        
        <div className="mt-auto pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex justify-between items-center"
            onClick={() => navigate(item.href)}
          >
            <span>Просмотр</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllPages;
