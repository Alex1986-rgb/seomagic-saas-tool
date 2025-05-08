
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading1, Heading2, Heading3, FileText, Tag, Image, Globe } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OptimizedContent {
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  h1?: string[];
  h2?: string[];
  h3?: string[];
  content?: string;
  altTags?: { image: string; alt: string }[];
  score?: {
    before: number;
    after: number;
  };
}

interface ContentOptimizationPreviewProps {
  url: string;
  optimizedContent?: OptimizedContent;
  originalContent?: {
    title?: string;
    metaDescription?: string;
    metaKeywords?: string;
    h1?: string[];
    h2?: string[];
    h3?: string[];
    content?: string;
  };
}

const ContentOptimizationPreview: React.FC<ContentOptimizationPreviewProps> = ({
  url,
  optimizedContent,
  originalContent
}) => {
  if (!optimizedContent) {
    return null;
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname + urlObj.pathname;
    } catch (e) {
      return url;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Результат оптимизации
            </CardTitle>
            <CardDescription>
              URL: {formatUrl(url)}
            </CardDescription>
          </div>
          {optimizedContent.score && (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Рейтинг SEO:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-red-500 bg-red-50">
                    {optimizedContent.score.before}/100
                  </Badge>
                  <span className="text-xs">→</span>
                  <Badge variant="outline" className="text-green-500 bg-green-50">
                    {optimizedContent.score.after}/100
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meta">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meta" className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Мета-теги</span>
              <span className="sm:hidden">Мета</span>
            </TabsTrigger>
            <TabsTrigger value="headings" className="flex items-center">
              <Heading1 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Заголовки</span>
              <span className="sm:hidden">H1-H3</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Контент</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              <span>Изображения</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meta" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тип</TableHead>
                  <TableHead>Было</TableHead>
                  <TableHead>Стало</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Title</TableCell>
                  <TableCell className="max-w-[200px] break-words">{originalContent?.title || 'Не указано'}</TableCell>
                  <TableCell className="max-w-[200px] break-words bg-green-50">
                    {optimizedContent.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Meta Description</TableCell>
                  <TableCell className="max-w-[200px] break-words">{originalContent?.metaDescription || 'Не указано'}</TableCell>
                  <TableCell className="max-w-[200px] break-words bg-green-50">
                    {optimizedContent.metaDescription}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Keywords</TableCell>
                  <TableCell className="max-w-[200px] break-words">{originalContent?.metaKeywords || 'Не указано'}</TableCell>
                  <TableCell className="max-w-[200px] break-words bg-green-50">
                    {optimizedContent.metaKeywords}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="headings" className="mt-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Heading1 className="mr-2 h-4 w-4" />
                  <h3 className="font-medium">Заголовки H1</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Было</TableHead>
                      <TableHead>Стало</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(optimizedContent.h1?.length || 0) > 0 ? (
                      optimizedContent.h1?.map((h1, index) => (
                        <TableRow key={`h1-${index}`}>
                          <TableCell>{originalContent?.h1?.[index] || 'Не указано'}</TableCell>
                          <TableCell className="bg-green-50">{h1}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          Нет данных о заголовках H1
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Heading2 className="mr-2 h-4 w-4" />
                  <h3 className="font-medium">Заголовки H2</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Было</TableHead>
                      <TableHead>Стало</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(optimizedContent.h2?.length || 0) > 0 ? (
                      optimizedContent.h2?.map((h2, index) => (
                        <TableRow key={`h2-${index}`}>
                          <TableCell>{originalContent?.h2?.[index] || 'Не указано'}</TableCell>
                          <TableCell className="bg-green-50">{h2}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          Нет данных о заголовках H2
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Heading3 className="mr-2 h-4 w-4" />
                  <h3 className="font-medium">Заголовки H3</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Было</TableHead>
                      <TableHead>Стало</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(optimizedContent.h3?.length || 0) > 0 ? (
                      optimizedContent.h3?.map((h3, index) => (
                        <TableRow key={`h3-${index}`}>
                          <TableCell>{originalContent?.h3?.[index] || 'Не указано'}</TableCell>
                          <TableCell className="bg-green-50">{h3}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          Нет данных о заголовках H3
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Исходный контент</h3>
                  <div className="prose prose-sm max-w-none">
                    {originalContent?.content ? (
                      <div className="whitespace-pre-wrap">{originalContent.content}</div>
                    ) : (
                      <p className="text-muted-foreground">Исходный контент недоступен</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-green-50">
                  <h3 className="font-medium mb-2">Оптимизированный контент</h3>
                  <div className="prose prose-sm max-w-none">
                    {optimizedContent.content ? (
                      <div className="whitespace-pre-wrap">{optimizedContent.content}</div>
                    ) : (
                      <p className="text-muted-foreground">Оптимизированный контент недоступен</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="mt-4">
            {optimizedContent.altTags && optimizedContent.altTags.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Изображение</TableHead>
                    <TableHead>Alt-текст</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimizedContent.altTags.map((item, index) => (
                    <TableRow key={`alt-${index}`}>
                      <TableCell className="font-medium max-w-[200px] break-words">{item.image}</TableCell>
                      <TableCell className="max-w-[300px] break-words bg-green-50">{item.alt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Нет данных об оптимизации изображений
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentOptimizationPreview;
