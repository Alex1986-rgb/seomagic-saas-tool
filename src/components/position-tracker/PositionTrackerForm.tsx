
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Search, X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { usePositionTracker } from "@/hooks/use-position-tracker";
import { useProxyManager } from "@/hooks/use-proxy-manager";

interface PositionTrackerFormProps {
  onSearchComplete?: (results: any) => void;
}

export function PositionTrackerForm({ onSearchComplete }: PositionTrackerFormProps) {
  const { toast } = useToast();
  const { activeProxies } = useProxyManager();
  const hasActiveProxies = activeProxies.length > 0;

  const {
    domain,
    setDomain,
    keywords,
    setKeywords,
    addKeyword,
    removeKeyword,
    searchEngine,
    setSearchEngine,
    region,
    setRegion,
    depth,
    setDepth,
    scanFrequency,
    setScanFrequency,
    isLoading,
    results,
    error,
    trackPositions
  } = usePositionTracker();

  const [inputKeyword, setInputKeyword] = React.useState("");
  const [bulkKeywords, setBulkKeywords] = React.useState("");
  const [keywordInputTab, setKeywordInputTab] = React.useState("single");

  const handleAddKeyword = () => {
    const trimmedKeyword = inputKeyword.trim();
    if (!trimmedKeyword) {
      toast({
        title: "Ошибка",
        description: "Введите ключевое слово",
        variant: "destructive",
      });
      return;
    }

    if (keywords.includes(trimmedKeyword)) {
      toast({
        title: "Предупреждение",
        description: "Это ключевое слово уже добавлено",
        variant: "default",
      });
      return;
    }

    addKeyword(trimmedKeyword);
    setInputKeyword("");
  };

  const handleAddBulkKeywords = () => {
    if (!bulkKeywords.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите список ключевых слов",
        variant: "destructive",
      });
      return;
    }

    const newKeywords = bulkKeywords
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k !== "" && !keywords.includes(k));

    if (newKeywords.length === 0) {
      toast({
        title: "Предупреждение",
        description: "Все введённые ключевые слова уже добавлены или некорректны",
        variant: "default",
      });
      return;
    }

    setKeywords([...keywords, ...newKeywords]);
    setBulkKeywords("");
    toast({
      title: "Добавлено",
      description: `Добавлено ${newKeywords.length} ключевых слов`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const fileKeywords = content
          .split(/\r?\n/)
          .map((k) => k.trim())
          .filter((k) => k !== "" && !keywords.includes(k));

        if (fileKeywords.length === 0) {
          toast({
            title: "Предупреждение",
            description: "В файле нет новых ключевых слов или файл пуст",
            variant: "default",
          });
          return;
        }

        setKeywords([...keywords, ...fileKeywords]);
        toast({
          title: "Импортировано",
          description: `Импортировано ${fileKeywords.length} ключевых слов из файла`,
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось прочитать файл",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast({
        title: "Ошибка",
        description: "Укажите домен для проверки",
        variant: "destructive",
      });
      return;
    }
    
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно ключевое слово",
        variant: "destructive",
      });
      return;
    }

    await trackPositions();
    
    if (results && onSearchComplete) {
      onSearchComplete(results);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <FormItem>
              <FormLabel>Домен</FormLabel>
              <FormControl>
                <Input
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Введите домен без http:// или https://
              </FormDescription>
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>Поисковая система</FormLabel>
              <Select
                value={searchEngine}
                onValueChange={setSearchEngine}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите поисковую систему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="yandex">Яндекс</SelectItem>
                  <SelectItem value="mailru">Mail.ru</SelectItem>
                  <SelectItem value="all">Все системы</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <FormItem>
              <FormLabel>Регион</FormLabel>
              <FormControl>
                <Input
                  placeholder="Москва"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>Глубина поиска (до {depth} результатов)</FormLabel>
              <FormControl>
                <Slider
                  min={10}
                  max={1000}
                  step={10}
                  value={[depth]}
                  onValueChange={(value) => setDepth(value[0])}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>Частота сканирования</FormLabel>
              <Select
                value={scanFrequency}
                onValueChange={setScanFrequency}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Однократно</SelectItem>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </div>

        {hasActiveProxies ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {activeProxies.length} активных прокси доступны для проверки.
              Это повысит точность результатов и поможет избежать блокировок.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Нет доступных прокси. Проверка будет выполнена напрямую,
              что может повлиять на точность результатов.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ключевые слова</CardTitle>
            <CardDescription>
              Добавьте ключевые слова для проверки позиций
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={keywordInputTab} onValueChange={setKeywordInputTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="single">По одному</TabsTrigger>
                <TabsTrigger value="bulk">Списком</TabsTrigger>
                <TabsTrigger value="file">Из файла</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите ключевое слово"
                    value={inputKeyword}
                    onChange={(e) => setInputKeyword(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddKeyword}
                    disabled={isLoading || !inputKeyword.trim()}
                  >
                    Добавить
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <Textarea
                  placeholder="Введите ключевые слова, по одному на строку"
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  disabled={isLoading}
                  rows={5}
                />
                <Button
                  type="button"
                  onClick={handleAddBulkKeywords}
                  disabled={isLoading || !bulkKeywords.trim()}
                >
                  Добавить список
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border rounded-md p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p>
                      Перетащите файл TXT или CSV с ключевыми словами или нажмите
                      чтобы выбрать
                    </p>
                    <Input
                      type="file"
                      accept=".txt,.csv"
                      className="max-w-xs"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <h4 className="font-medium mb-2">
                Добавленные ключевые слова: {keywords.length}
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge variant="secondary" key={index}>
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {keywords.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Нет добавленных ключевых слов
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isLoading || keywords.length === 0 || !domain.trim()}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>Проверка позиций...</>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Проверить позиции
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
