import { useState, useEffect } from 'react';
import { Eye, Download, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CrawledPage {
  id: string;
  url: string;
  html: string | null;
  status_code: number | null;
  headers: any;
  crawled_at: string | null;
}

interface CrawledPagesViewerProps {
  auditId: string;
}

export const CrawledPagesViewer = ({ auditId }: CrawledPagesViewerProps) => {
  const [pages, setPages] = useState<CrawledPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<CrawledPage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<CrawledPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, [auditId]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPages(
        pages.filter(page => 
          page.url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPages(pages);
    }
  }, [searchQuery, pages]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crawled_pages')
        .select('*')
        .eq('audit_id', auditId)
        .order('crawled_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
      setFilteredPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить страницы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPage = (page: CrawledPage) => {
    const blob = new Blob([page.html || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = page.url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9-_.]/g, '_') + '.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Собранные страницы ({filteredPages.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'Ничего не найдено' : 'Нет собранных страниц'}
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={page.status_code === 200 ? 'default' : 'destructive'}>
                          {page.status_code || 'N/A'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(page.html?.length || 0)}
                        </span>
                        {page.crawled_at && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(page.crawled_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPage(page)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadPage(page)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPage} onOpenChange={() => setSelectedPage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{selectedPage?.url}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedPage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
              <TabsTrigger value="source">Исходный код</TabsTrigger>
              <TabsTrigger value="metadata">Метаданные</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <ScrollArea className="h-96 border rounded">
                <iframe
                  srcDoc={selectedPage?.html || ''}
                  className="w-full h-full"
                  sandbox="allow-same-origin"
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="source" className="mt-4">
              <ScrollArea className="h-96">
                <pre className="text-xs p-4 bg-muted rounded">
                  {selectedPage?.html || 'Нет данных'}
                </pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="metadata" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-4 p-4">
                  <div>
                    <h4 className="font-semibold mb-2">Статус</h4>
                    <Badge variant={selectedPage?.status_code === 200 ? 'default' : 'destructive'}>
                      {selectedPage?.status_code || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Размер</h4>
                    <p>{formatBytes(selectedPage?.html?.length || 0)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Время сбора</h4>
                    <p>{selectedPage?.crawled_at ? new Date(selectedPage.crawled_at).toLocaleString() : 'N/A'}</p>
                  </div>
                  {selectedPage?.headers && (
                    <div>
                      <h4 className="font-semibold mb-2">Заголовки</h4>
                      <pre className="text-xs p-2 bg-muted rounded">
                        {JSON.stringify(selectedPage.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
