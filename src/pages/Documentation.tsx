
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGuide from '@/components/documentation/UserGuide';
import DeveloperGuide from '@/components/documentation/DeveloperGuide';
import SecurityDocs from '@/components/documentation/SecurityDocs';
import FAQ from '@/components/documentation/FAQ';
import { motion } from 'framer-motion';

type DocumentationTab = 'user-guide' | 'developer-guide' | 'security' | 'faq';

const Documentation: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const defaultTab: DocumentationTab = (tab as DocumentationTab) || 'user-guide';
  
  // Validate tab parameter
  const validTabs: DocumentationTab[] = ['user-guide', 'developer-guide', 'security', 'faq'];
  if (tab && !validTabs.includes(tab as DocumentationTab)) {
    return <Navigate to="/documentation/user-guide" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Документация</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полная документация по использованию и разработке SeoMarket
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-8">
              <TabsTrigger value="user-guide">Руководство пользователя</TabsTrigger>
              <TabsTrigger value="developer-guide">Для разработчиков</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <div className="bg-background/50 backdrop-blur-sm border rounded-lg p-6 shadow-md">
              <TabsContent value="user-guide">
                <UserGuide />
              </TabsContent>
              
              <TabsContent value="developer-guide">
                <DeveloperGuide />
              </TabsContent>
              
              <TabsContent value="security">
                <SecurityDocs />
              </TabsContent>
              
              <TabsContent value="faq">
                <FAQ />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
