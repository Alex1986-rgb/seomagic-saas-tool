
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { positionTrackerFormSchema, type FormData } from './form/schema';
import { usePositionTrackerForm } from './form/usePositionTrackerForm';
import { KeywordInput } from './form/KeywordInput';
import { KeywordsList } from './form/KeywordsList';
import { KeywordTabs } from './form/KeywordTabs';

interface PositionTrackerFormProps {
  onSearchComplete?: (results: any) => void;
}

export function PositionTrackerForm({ onSearchComplete }: PositionTrackerFormProps) {
  const { toast } = useToast();
  const {
    form,
    keywords,
    inputKeyword,
    isLoading,
    setInputKeyword,
    addKeyword,
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  } = usePositionTrackerForm(onSearchComplete);

  const handleFormSubmit = form.handleSubmit(onSubmit);

  const hasActiveProxies = true; // This would normally come from a hook or context

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Домен</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Введите домен без http:// или https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="searchEngine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поисковая система</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите поисковую систему" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="yandex">Яндекс</SelectItem>
                        <SelectItem value="mailru">Mail.ru</SelectItem>
                        <SelectItem value="all">Все системы</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регион</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Москва"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Глубина поиска (до {field.value} результатов)</FormLabel>
                    <FormControl>
                      <Slider
                        min={10}
                        max={1000}
                        step={10}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="scanFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Частота сканирования</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
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
          </div>

          {hasActiveProxies ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Активные прокси доступны для проверки.
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
              <KeywordTabs
                inputKeyword={inputKeyword}
                setInputKeyword={setInputKeyword}
                addKeyword={addKeyword}
                handleBulkKeywords={handleBulkKeywords}
                handleFileUpload={handleFileUpload}
                isLoading={isLoading}
              />

              <KeywordsList 
                keywords={keywords} 
                removeKeyword={(index) => removeKeyword(keywords[index])}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading || keywords.length === 0}
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
    </Form>
  );
}
