
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save, Brain, Layers, FileCode, Bot, RotateCw, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { openaiService } from '@/services/api/openaiService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const aiConfigSchema = z.object({
  openai_api_key: z.string().min(1, "API ключ обязателен для AI-функций"),
  openai_model: z.string().min(1, "Выберите модель"),
  auto_optimize: z.boolean().default(true),
  auto_fix_errors: z.boolean().default(true),
  content_quality: z.enum(["standard", "premium", "ultimate"]).default("premium"),
  max_tokens: z.number().min(100).max(16000).default(2500),
  temperature: z.number().min(0).max(2).default(0.7)
});

const AISettings = () => {
  const { toast } = useToast();
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("openai");

  const form = useForm<z.infer<typeof aiConfigSchema>>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      openai_api_key: "",
      openai_model: "gpt-4o-mini",
      auto_optimize: true,
      auto_fix_errors: true,
      content_quality: "premium",
      max_tokens: 2500,
      temperature: 0.7
    },
  });

  React.useEffect(() => {
    const storedApiKey = openaiService.getApiKey();
    const storedModel = openaiService.getModel();
    setHasApiKey(!!storedApiKey);
    
    if (storedApiKey) {
      form.setValue("openai_api_key", storedApiKey);
    }
    
    if (storedModel) {
      form.setValue("openai_model", storedModel);
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof aiConfigSchema>) => {
    if (values.openai_api_key) {
      openaiService.setApiKey(values.openai_api_key);
      setHasApiKey(true);
    }
    openaiService.setModel(values.openai_model);
    localStorage.setItem('ai_settings', JSON.stringify({
      auto_optimize: values.auto_optimize,
      auto_fix_errors: values.auto_fix_errors,
      content_quality: values.content_quality,
      max_tokens: values.max_tokens,
      temperature: values.temperature
    }));
    
    setIsSaved(true);
    toast({
      title: "Настройки сохранены",
      description: "Настройки AI успешно обновлены",
    });
    
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Настройки искусственного интеллекта</h2>
      </div>

      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
        <CardContent className="p-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="openai" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>OpenAI</span>
              </TabsTrigger>
              <TabsTrigger value="scanning" className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>Сканирование</span>
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Оптимизация</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Расширенные</span>
              </TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="openai" className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="openai_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OpenAI API Ключ</FormLabel>
                          <FormDescription>
                            API ключ используется для автоматической оптимизации контента, мета-тегов и заголовков с помощью ИИ.
                          </FormDescription>
                          <FormControl>
                            <Input type="password" placeholder="Введите ваш OpenAI API ключ" className="max-w-md" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="openai_model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Модель OpenAI</FormLabel>
                          <FormDescription>
                            Выберите модель OpenAI для оптимизации контента и интеграции в систему.
                          </FormDescription>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="max-w-md">
                                <SelectValue placeholder="Выберите модель" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gpt-4o-mini">GPT-4O Mini (Быстрая и экономичная)</SelectItem>
                              <SelectItem value="gpt-4o">GPT-4O (Мощная)</SelectItem>
                              <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Новейшая и самая мощная)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="scanning" className="space-y-4">
                  <div className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Автоматическое сканирование сайта</h3>
                        <p className="text-sm text-muted-foreground">Система будет автоматически анализировать структуру сайта и его контент</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="auto_optimize"
                        render={({ field }) => (
                          <FormItem>
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

                  <div className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Автоматическое исправление ошибок</h3>
                        <p className="text-sm text-muted-foreground">Система будет исправлять найденные ошибки в структуре и контенте</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="auto_fix_errors"
                        render={({ field }) => (
                          <FormItem>
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
                </TabsContent>

                <TabsContent value="optimization" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content_quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Качество генерации контента</FormLabel>
                        <FormDescription>
                          Выберите уровень качества для автоматически создаваемого и оптимизируемого контента
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="max-w-md">
                              <SelectValue placeholder="Выберите уровень качества" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Стандартное (Быстрее, но менее детализированное)</SelectItem>
                            <SelectItem value="premium">Премиум (Оптимально)</SelectItem>
                            <SelectItem value="ultimate">Максимальное (Высокое качество, но затратнее)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="max_tokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Максимальное количество токенов</FormLabel>
                        <FormDescription>
                          Максимальное количество токенов для генерации контента (влияет на стоимость и объем)
                        </FormDescription>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={100} 
                            max={16000} 
                            className="max-w-md" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Температура генерации</FormLabel>
                        <FormDescription>
                          Регулирует креативность модели (ниже - более предсказуемо, выше - более творчески)
                        </FormDescription>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={2} 
                            step={0.1}
                            className="max-w-md" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <div className="flex flex-col space-y-2">
                  <Button type="submit" className="flex gap-2 w-full md:w-auto">
                    <Save className="h-4 w-4" />
                    Сохранить настройки
                  </Button>
                  
                  {hasApiKey && <span className="text-xs text-muted-foreground">API ключ сохранен. Все функции ИИ активированы.</span>}
                </div>
              </form>
            </Form>
          </Tabs>

          {isSaved && (
            <Alert className="bg-green-500/10 border border-green-500/20">
              <AlertDescription className="text-green-600">
                Настройки успешно сохранены
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Интеграции с другими нейросетями</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
                      <img src="https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png" className="w-5 h-5" alt="OpenAI" />
                    </div>
                    <h4 className="font-medium">OpenAI DALL-E</h4>
                  </div>
                  <Switch id="dall-e" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Интеграция для генерации и оптимизации изображений с помощью DALL-E
                </p>
                <div className="text-xs bg-muted p-1.5 rounded">
                  Использует существующий ключ OpenAI API
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md">
                      <img src="https://huggingface.co/front/assets/huggingface_logo.svg" className="w-5 h-5" alt="Hugging Face" />
                    </div>
                    <h4 className="font-medium">Hugging Face</h4>
                  </div>
                  <Switch id="huggingface" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Интеграция с открытыми моделями для обработки текста и изображений
                </p>
                <Input placeholder="Введите Hugging Face API ключ" className="text-xs" />
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
                      <img src="https://i.ibb.co/JCvTdQy/anthropic-favicon.png" className="w-5 h-5" alt="Anthropic" />
                    </div>
                    <h4 className="font-medium">Anthropic Claude</h4>
                  </div>
                  <Switch id="anthropic" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Продвинутый ИИ для обработки контента и семантического анализа
                </p>
                <Input placeholder="Введите Claude API ключ" className="text-xs" />
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md">
                      <img src="https://i.ibb.co/G0fbWHB/google-favicon.png" className="w-5 h-5" alt="Google" />
                    </div>
                    <h4 className="font-medium">Google Gemini</h4>
                  </div>
                  <Switch id="gemini" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Многоязычный ИИ для оптимизации и создания контента
                </p>
                <Input placeholder="Введите Gemini API ключ" className="text-xs" />
              </div>
            </div>

            <Button variant="outline" className="w-full mt-2">
              Сохранить настройки интеграций
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
