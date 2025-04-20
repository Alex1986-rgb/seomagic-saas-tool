import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search, Plus, X, FileSpreadsheet, Clock, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { checkPositions } from '@/services/position/positionTracker';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  domain: z.string().min(1, { message: "Домен обязателен для заполнения" }).url({ message: "Введите корректный URL" }),
  searchEngine: z.enum(["google", "yandex", "mailru", "all"]),
  region: z.string().optional(),
  keywords: z.array(z.string()).min(1, { message: "Добавьте хотя бы один ключевой запрос" }),
  depth: z.number().min(10).max(100),
  useProxy: z.boolean().default(false),
  scanFrequency: z.enum(["once", "daily", "weekly", "monthly"]).default("once"),
});

export const PositionTrackerForm = ({ onSearchComplete }) => {
  const [keywords, setKeywords] = useState([]);
  const [inputKeyword, setInputKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      searchEngine: "all",
      region: "",
      keywords: [],
      depth: 30,
      useProxy: false,
      scanFrequency: "once",
    },
  });

  const addKeyword = () => {
    if (inputKeyword.trim()) {
      setKeywords([...keywords, inputKeyword.trim()]);
      form.setValue("keywords", [...keywords, inputKeyword.trim()]);
      setInputKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  };

  const handleBulkKeywords = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.trim()) return;
    
    const keywordList = text.split(/\r?\n/).filter(k => k.trim());
    setKeywords([...keywordList]);
    form.setValue("keywords", keywordList);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const keywordList = text.split(/\r?\n/).filter(k => k.trim());
        setKeywords([...new Set([...keywords, ...keywordList])]);
        form.setValue("keywords", [...new Set([...keywords, ...keywordList])]);
        toast({
          title: "Файл загружен",
          description: `Добавлено ${keywordList.length} ключевых слов`,
        });
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось прочитать файл",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один ключевой запрос для проверки",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const searchData = {
        domain: values.domain,
        keywords: keywords,
        searchEngine: values.searchEngine,
        region: values.region,
        depth: values.depth,
        scanFrequency: values.scanFrequency,
        useProxy: values.useProxy,
        timestamp: new Date().toISOString()
      };
      
      const results = await checkPositions(searchData);
      
      toast({
        title: "Проверка завершена",
        description: `Проверено ${keywords.length} ключевых запросов в ${values.searchEngine === 'all' ? 'нескольких поисковых системах' : values.searchEngine}`,
      });
      
      if (onSearchComplete) {
        onSearchComplete(results);
      }
    } catch (error) {
      toast({
        title: "Ошибка при проверке позиций",
        description: error.message || "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Домен для проверки</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Введите URL сайта, позиции которого хотите проверить
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <FormField
                  control={form.control}
                  name="searchEngine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Поисковая система</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите поисковик" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Все поисковики</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="yandex">Яндекс</SelectItem>
                          <SelectItem value="mailru">Mail.ru</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Регион (опционально)</FormLabel>
                      <FormControl>
                        <Input placeholder="Москва" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Глубина проверки</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={10} 
                          max={100} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormDescription>
                        Количество позиций для проверки (10-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scanFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Частота проверки</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите частоту" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="once">Однократно</SelectItem>
                          <SelectItem value="daily">Ежедневно</SelectItem>
                          <SelectItem value="weekly">Еженедельно</SelectItem>
                          <SelectItem value="monthly">Ежемесячно</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="useProxy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Использовать прокси
                        </FormLabel>
                        <FormDescription>
                          Помогает обойти ограничения поисковых систем
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <Tabs defaultValue="single" className="w-full">
                <TabsList>
                  <TabsTrigger value="single">Добавление по одному</TabsTrigger>
                  <TabsTrigger value="bulk">Массовое добавление</TabsTrigger>
                  <TabsTrigger value="file">Загрузка файла</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Введите ключевое слово"
                      value={inputKeyword}
                      onChange={(e) => setInputKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                    />
                    <Button type="button" onClick={addKeyword} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Введите ключевое слово и нажмите + или Enter для добавления
                  </FormDescription>
                </TabsContent>
                
                <TabsContent value="bulk">
                  <Textarea
                    placeholder="Введите ключевые слова, каждое с новой строки"
                    className="h-24"
                    onChange={handleBulkKeywords}
                  />
                  <FormDescription className="mt-2">
                    Введите список ключевых слов, каждое с новой строки
                  </FormDescription>
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Загрузите файл с ключевыми словами (.txt или .csv, каждое слово с новой строки)
                    </FormDescription>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                <FormLabel>Добавленные ключевые слова ({keywords.length})</FormLabel>
                <Card className="mt-2">
                  <CardContent className="p-4 max-h-[250px] overflow-y-auto">
                    {keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 py-2">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Добавьте ключевые слова для проверки позиций
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Импорт из Excel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Проверить позиции
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
