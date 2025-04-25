
import React from 'react';
import { Monitor, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import DemoTab from './DemoTab';

const WebsiteAnalyzerTabs: React.FC = () => {
  return (
    <Tabs defaultValue="scanner" className="mb-4">
      <TabsList className="flex w-full gap-2 bg-[#1B1C2B] rounded-xl p-1 border border-[#22213B]">
        <TabsTrigger value="scanner" className="flex gap-2 text-[#36CFFF] data-[state=active]:bg-[#36CFFF] data-[state=active]:text-white font-semibold rounded-lg transition-all px-3 py-1.5">
          <Monitor className="h-5 w-5" />
          Сканер
        </TabsTrigger>
        <TabsTrigger value="demo" className="flex gap-2 text-[#F97316] data-[state=active]:bg-[#F97316]/90 data-[state=active]:text-white font-semibold rounded-lg transition-all px-3 py-1.5">
          <BarChart className="h-5 w-5" />
          Возможности
        </TabsTrigger>
      </TabsList>
      <TabsContent value="scanner" className="mt-5">
        <WebsiteScanner />
      </TabsContent>
      <TabsContent value="demo" className="mt-5">
        <DemoTab />
      </TabsContent>
    </Tabs>
  );
};

export default WebsiteAnalyzerTabs;
