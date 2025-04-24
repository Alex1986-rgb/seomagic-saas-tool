
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Image, 
  Search, 
  Layout, 
  Link as LinkIcon,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface BaseContentEditorProps {
  title: string;
  description: string;
  onSave: (data: any) => void;
  children?: React.ReactNode;
}

const BaseContentEditor: React.FC<BaseContentEditorProps> = ({
  title,
  description,
  onSave,
  children
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    onSave({});
    toast({
      title: "Изменения сохранены",
      description: "Контент успешно обновлен",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="text-gray-400">{description}</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content">
            <TabsList className="mb-6 bg-black/20">
              <TabsTrigger value="content" className="data-[state=active]:bg-primary/20">
                <FileText className="h-4 w-4 mr-2" />
                Контент
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-primary/20">
                <Search className="h-4 w-4 mr-2" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-primary/20">
                <Layout className="h-4 w-4 mr-2" />
                Макет
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              {children}
            </TabsContent>

            <TabsContent value="seo">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Title</label>
                  <Input 
                    placeholder="Введите meta title..." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Description</label>
                  <Textarea 
                    placeholder="Введите meta description..." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords</label>
                  <Input 
                    placeholder="Введите ключевые слова через запятую..." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">CSS Классы</label>
                  <Input 
                    placeholder="Введите CSS классы..." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Порядок отображения</label>
                  <Input 
                    type="number" 
                    placeholder="Введите порядок..." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Сохранить изменения
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseContentEditor;
