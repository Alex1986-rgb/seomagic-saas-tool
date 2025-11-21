import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserGuide from '@/components/documentation/UserGuide';
import DeveloperGuide from '@/components/documentation/DeveloperGuide';
import SecurityDocs from '@/components/documentation/SecurityDocs';
import FAQ from '@/components/documentation/FAQ';
import { motion } from 'framer-motion';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { 
  BookOpen, 
  Code, 
  Shield, 
  HelpCircle, 
  Search,
  Download,
  Star,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

type DocumentationTab = 'user-guide' | 'developer-guide' | 'security' | 'faq';

const Documentation: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const defaultTab: DocumentationTab = (tab as DocumentationTab) || 'user-guide';
  
  // Validate tab parameter
  const validTabs: DocumentationTab[] = ['user-guide', 'developer-guide', 'security', 'faq'];
  if (tab && !validTabs.includes(tab as DocumentationTab)) {
    return <Navigate to="/documentation/user-guide" replace />;
  }

  const tabsData = [
    {
      value: 'user-guide',
      label: 'Руководство пользователя',
      icon: BookOpen,
      description: 'Пошаговые инструкции для начала работы',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'developer-guide',
      label: 'Для разработчиков',
      icon: Code,
      description: 'API документация и техническая информация',
      color: 'from-green-500 to-green-600'
    },
    {
      value: 'security',
      label: 'Безопасность',
      icon: Shield,
      description: 'Политики безопасности и лучшие практики',
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'faq',
      label: 'FAQ',
      icon: HelpCircle,
      description: 'Ответы на часто задаваемые вопросы',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Документация', url: '/documentation' }
      ]} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-32">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Документация
              </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              База знаний SeoMarket
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Исчерпывающее руководство по использованию всех возможностей платформы SeoMarket. 
              От базовых функций до продвинутых техник оптимизации.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
              <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
                Поиск в документации
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
                Скачать PDF
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <Card className="neo-card text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Рейтинг документации</div>
                </CardContent>
              </Card>
              
              <Card className="neo-card text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Активных пользователей</div>
                </CardContent>
              </Card>
              
              <Card className="neo-card text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Поддержка</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs defaultValue={defaultTab} className="w-full">
              {/* Proper Tab Navigation with visual cards */}
              <div className="mb-8">
                <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto bg-transparent p-0">
                  {tabsData.map((tabData) => (
                    <TabsTrigger
                      key={tabData.value}
                      value={tabData.value}
                      className="h-auto p-0 data-[state=active]:bg-transparent"
                    >
                      <div className="neo-card w-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-primary p-6 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tabData.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                          <tabData.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{tabData.label}</h3>
                        <p className="text-sm text-muted-foreground">{tabData.description}</p>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Tab Content */}
              <Card className="neo-card overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <TabsContent value="user-guide" className="mt-0">
                    <UserGuide />
                  </TabsContent>
                  
                  <TabsContent value="developer-guide" className="mt-0">
                    <DeveloperGuide />
                  </TabsContent>
                  
                  <TabsContent value="security" className="mt-0">
                    <SecurityDocs />
                  </TabsContent>
                  
                  <TabsContent value="faq" className="mt-0">
                    <FAQ />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="neo-card bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Нужна дополнительная помощь?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Наша команда поддержки готова помочь вам в любое время. 
                  Свяжитесь с нами, если у вас остались вопросы.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2 hover:scale-105 transition-transform">
                    Связаться с поддержкой
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                    Сообщество пользователей
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
