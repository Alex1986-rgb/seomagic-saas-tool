
import React, { useState, useEffect } from 'react';
import { FolderTree, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SiteNode {
  id: string;
  name: string;
  url: string;
  type: 'page' | 'directory' | 'image' | 'document' | 'other';
  children?: SiteNode[];
}

interface SiteStructureVisualizationProps {
  domain?: string;
  className?: string;
}

export function SiteStructureVisualization({ domain = '', className }: SiteStructureVisualizationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputDomain, setInputDomain] = useState(domain);
  const [structure, setStructure] = useState<SiteNode | null>(null);
  const [viewType, setViewType] = useState<'tree' | 'list' | 'graph'>('tree');
  const { toast } = useToast();

  useEffect(() => {
    if (domain) {
      setInputDomain(domain);
      if (!structure) {
        loadStructure(domain);
      }
    }
  }, [domain]);

  const loadStructure = async (domainToLoad: string) => {
    if (!domainToLoad) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите домен для визуализации",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Здесь в реальном приложении был бы настоящий запрос к API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Генерируем пример структуры сайта для демо
      const mockStructure: SiteNode = {
        id: 'root',
        name: domainToLoad,
        url: `https://${domainToLoad}/`,
        type: 'directory',
        children: [
          {
            id: 'home',
            name: 'Главная',
            url: `https://${domainToLoad}/`,
            type: 'page'
          },
          {
            id: 'about',
            name: 'О компании',
            url: `https://${domainToLoad}/about`,
            type: 'page',
            children: [
              {
                id: 'team',
                name: 'Команда',
                url: `https://${domainToLoad}/about/team`,
                type: 'page'
              },
              {
                id: 'history',
                name: 'История',
                url: `https://${domainToLoad}/about/history`,
                type: 'page'
              }
            ]
          },
          {
            id: 'products',
            name: 'Продукты',
            url: `https://${domainToLoad}/products`,
            type: 'directory',
            children: [
              {
                id: 'product1',
                name: 'Продукт 1',
                url: `https://${domainToLoad}/products/product1`,
                type: 'page'
              },
              {
                id: 'product2',
                name: 'Продукт 2',
                url: `https://${domainToLoad}/products/product2`,
                type: 'page'
              },
              {
                id: 'product3',
                name: 'Продукт 3',
                url: `https://${domainToLoad}/products/product3`,
                type: 'page'
              }
            ]
          },
          {
            id: 'blog',
            name: 'Блог',
            url: `https://${domainToLoad}/blog`,
            type: 'directory',
            children: [
              {
                id: 'post1',
                name: 'Пост 1',
                url: `https://${domainToLoad}/blog/post1`,
                type: 'page'
              },
              {
                id: 'post2',
                name: 'Пост 2',
                url: `https://${domainToLoad}/blog/post2`,
                type: 'page'
              }
            ]
          },
          {
            id: 'contact',
            name: 'Контакты',
            url: `https://${domainToLoad}/contact`,
            type: 'page'
          },
          {
            id: 'images',
            name: 'Изображения',
            url: `https://${domainToLoad}/images`,
            type: 'directory',
            children: Array(5).fill(0).map((_, index) => ({
              id: `image-${index}`,
              name: `image-${index}.jpg`,
              url: `https://${domainToLoad}/images/image-${index}.jpg`,
              type: 'image' as const
            }))
          },
          {
            id: 'documents',
            name: 'Документы',
            url: `https://${domainToLoad}/documents`,
            type: 'directory',
            children: [
              {
                id: 'doc1',
                name: 'Документ 1.pdf',
                url: `https://${domainToLoad}/documents/doc1.pdf`,
                type: 'document'
              },
              {
                id: 'doc2',
                name: 'Документ 2.pdf',
                url: `https://${domainToLoad}/documents/doc2.pdf`,
                type: 'document'
              }
            ]
          }
        ]
      };
      
      setStructure(mockStructure);
      
      toast({
        title: "Структура загружена",
        description: `Визуализация структуры сайта готова`,
      });
    } catch (error) {
      console.error('Ошибка загрузки структуры:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить структуру сайта",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForNodeType = (type: string) => {
    switch (type) {
      case 'page':
        return <div className="h-4 w-4 rounded-full bg-blue-500"></div>;
      case 'directory':
        return <div className="h-4 w-4 rounded-sm bg-amber-500"></div>;
      case 'image':
        return <div className="h-4 w-4 rounded-full bg-green-500"></div>;
      case 'document':
        return <div className="h-4 w-4 rounded-sm bg-red-500"></div>;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-500"></div>;
    }
  };

  const renderTreeNode = (node: SiteNode, level = 0) => {
    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center py-1">
          {getIconForNodeType(node.type)}
          <span className="ml-2 text-sm">{node.name}</span>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="border-l-2 border-gray-200 pl-2">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderListNode = (nodes: SiteNode[], level = 0) => {
    return (
      <ul className={`pl-${level > 0 ? '4' : '0'} space-y-1`}>
        {nodes.map(node => (
          <li key={node.id}>
            <div className="flex items-center py-1">
              {getIconForNodeType(node.type)}
              <span className="ml-2 text-sm truncate" title={node.url}>
                {node.name}
              </span>
            </div>
            {node.children && node.children.length > 0 && renderListNode(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const renderGraph = (rootNode: SiteNode) => {
    // Упрощенная визуализация графа для демонстрации
    return (
      <div className="flex flex-col items-center pt-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-sm">
          Root
        </div>
        <div className="w-0.5 h-8 bg-gray-300 my-2"></div>
        <div className="flex flex-wrap gap-4 justify-center">
          {rootNode.children?.map((child, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xs">
                {child.name.substring(0, 6)}
              </div>
              {child.children && child.children.length > 0 && (
                <>
                  <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                    {child.children.map((grandchild, j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        {grandchild.name.substring(0, 2)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-blue-500" />
            Визуализация структуры сайта
          </CardTitle>
          <CardDescription>
            Наглядное представление иерархии страниц и разделов сайта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="domain" className="block text-sm font-medium mb-1">Домен для визуализации</label>
              <Input
                id="domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
              />
            </div>
            <Button 
              onClick={() => loadStructure(inputDomain)} 
              disabled={isLoading || !inputDomain}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FolderTree className="h-4 w-4" />
              )}
              {isLoading ? 'Загрузка...' : 'Показать структуру'}
            </Button>
          </div>

          {structure && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Структура сайта {structure.name}</div>
                <Select
                  value={viewType}
                  onValueChange={(value: 'tree' | 'list' | 'graph') => setViewType(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите вид" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tree">Дерево</SelectItem>
                    <SelectItem value="list">Список</SelectItem>
                    <SelectItem value="graph">График</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4 max-h-[400px] overflow-auto">
                {viewType === 'tree' && (
                  <div>
                    <div className="flex items-center py-1">
                      {getIconForNodeType('directory')}
                      <span className="ml-2 font-medium">{structure.name}</span>
                    </div>
                    {structure.children?.map(child => renderTreeNode(child))}
                  </div>
                )}
                {viewType === 'list' && structure.children && renderListNode([structure])}
                {viewType === 'graph' && renderGraph(structure)}
              </div>

              <div className="flex items-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Страница</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm bg-amber-500"></div>
                  <span>Раздел</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Изображение</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm bg-red-500"></div>
                  <span>Документ</span>
                </div>
              </div>
            </>
          )}

          {!structure && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              {inputDomain ? 'Нажмите кнопку для загрузки структуры сайта' : 'Введите домен для начала анализа'}
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
