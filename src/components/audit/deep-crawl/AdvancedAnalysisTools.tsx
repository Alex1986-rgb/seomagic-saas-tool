
import React, { useState } from 'react';
import { ScrollText, Microscope, Braces, LinkIcon, Copy, FileText, BarChart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BrokenLinksAnalysis from './components/BrokenLinksAnalysis';
import DuplicatesAnalysis from './components/DuplicatesAnalysis';
import ContentUniquenessAnalysis from './components/ContentUniquenessAnalysis';
import SiteStructureAnalysis from './components/SiteStructureAnalysis';
import { SimpleSitemapCreatorTool } from './index';

interface AdvancedAnalysisToolsProps {
  domain: string;
  urls: string[];
}

const AdvancedAnalysisTools: React.FC<AdvancedAnalysisToolsProps> = ({ domain, urls }) => {
  const [activeTab, setActiveTab] = useState('broken-links');

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-primary" />
          <CardTitle>Расширенный анализ сайта</CardTitle>
        </div>
        <CardDescription>
          Инструменты для глубокого технического анализа структуры сайта и обнаружения проблем
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="broken-links" className="flex gap-2 items-center text-xs md:text-sm">
              <LinkIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Битые ссылки</span>
              <span className="md:hidden">Ссылки</span>
            </TabsTrigger>
            <TabsTrigger value="duplicates" className="flex gap-2 items-center text-xs md:text-sm">
              <Copy className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Дубликаты</span>
              <span className="md:hidden">Дубли</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex gap-2 items-center text-xs md:text-sm">
              <BarChart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Структура</span>
              <span className="md:hidden">Структ.</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex gap-2 items-center text-xs md:text-sm">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Уникальность</span>
              <span className="md:hidden">Уник.</span>
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="flex gap-2 items-center text-xs md:text-sm">
              <ScrollText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Карта сайта</span>
              <span className="md:hidden">Sitemap</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="broken-links">
            <BrokenLinksAnalysis domain={domain} urls={urls} />
          </TabsContent>
          
          <TabsContent value="duplicates">
            <DuplicatesAnalysis domain={domain} urls={urls} />
          </TabsContent>
          
          <TabsContent value="structure">
            <SiteStructureAnalysis domain={domain} urls={urls} />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentUniquenessAnalysis domain={domain} urls={urls} />
          </TabsContent>
          
          <TabsContent value="sitemap">
            <SimpleSitemapCreatorTool initialUrl={domain} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Инструменты помогают выявить технические проблемы и улучшить SEO показатели вашего сайта
      </CardFooter>
    </Card>
  );
};

export default AdvancedAnalysisTools;
