
import React from 'react';
import Layout from '@/components/Layout';
import ProjectOverview from '@/components/project-details/ProjectOverview';
import TechnicalArchitecture from '@/components/project-details/TechnicalArchitecture';
import FeaturesStatus from '@/components/project-details/FeaturesStatus';
import DevelopmentRoadmap from '@/components/project-details/DevelopmentRoadmap';
import ProductionReadiness from '@/components/project-details/ProductionReadiness';
import ScalabilityPlanning from '@/components/project-details/ScalabilityPlanning';
import ProjectExporter from '@/components/project-details/ProjectExporter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const ProjectDetails: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SeoMarket - Детали проекта
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Полное техническое описание проекта, готовность к продакшн и стратегия масштабирования
            </p>
            <div className="mt-6">
              <ProjectExporter />
            </div>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="architecture">Архитектура</TabsTrigger>
                <TabsTrigger value="features">Статус функций</TabsTrigger>
                <TabsTrigger value="production">Продакшн</TabsTrigger>
                <TabsTrigger value="scaling">Масштабирование</TabsTrigger>
                <TabsTrigger value="roadmap">Роадмап</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <ProjectOverview />
              </TabsContent>
              
              <TabsContent value="architecture" className="mt-6">
                <TechnicalArchitecture />
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <FeaturesStatus />
              </TabsContent>
              
              <TabsContent value="production" className="mt-6">
                <ProductionReadiness />
              </TabsContent>
              
              <TabsContent value="scaling" className="mt-6">
                <ScalabilityPlanning />
              </TabsContent>
              
              <TabsContent value="roadmap" className="mt-6">
                <DevelopmentRoadmap />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
