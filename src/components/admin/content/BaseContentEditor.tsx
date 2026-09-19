import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Layout
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';

/**
 * Каркас редакторов страниц в админке.
 *
 * Внизу стояла кнопка «Сохранить изменения»: она вызывала onSave({}) — пустой
 * объект, который редакторы только печатали в консоль, — и показывала тост
 * «Изменения сохранены. Контент успешно обновлен». После перезагрузки правок не
 * было, на сайте ничего не менялось: хранилища контента нет, тексты страниц
 * заданы в коде. Кнопка и тост убраны, вместо них — предупреждение над формой.
 */
interface BaseContentEditorProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const BaseContentEditor: React.FC<BaseContentEditorProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="text-gray-400">{description}</p>
        </CardHeader>
        <CardContent>
          <NotCollectedNotice
            className="mb-6 bg-black/20 border-white/10 text-white"
            title="Редактор пока не сохраняет изменения"
            description="Хранилища контента нет: тексты страниц сайта заданы в коде. Правки в этой форме никуда не записываются, на сайте не появятся и пропадут после перезагрузки."
          />

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
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseContentEditor;
