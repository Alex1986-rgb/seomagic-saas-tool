
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, UploadCloud, Plus, X } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePositionTrackerForm } from './form/usePositionTrackerForm';

interface FormValues {
  domain: string;
  keywords?: string[];
  searchEngine: "google" | "yandex" | "mailru" | "all";
  region?: string;
}

interface PositionTrackerFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  defaultValues?: FormValues;
  onAddKeyword?: (keyword: string) => void;
  onRemoveKeyword?: (keyword: string) => void;
  setKeywords?: (keywords: string[]) => void;
}

export const PositionTrackerForm: React.FC<PositionTrackerFormProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
  onAddKeyword,
  onRemoveKeyword,
  setKeywords,
}) => {
  const {
    form,
    keywords,
    inputKeyword,
    setInputKeyword,
    addKeyword: addKeywordLocal,
    removeKeyword: removeKeywordLocal,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit: handleSubmit
  } = usePositionTrackerForm((results: any) => {
    onSubmit({
      ...form.getValues(),
      keywords: keywords
    });
  });

  // Initialize form with default values if provided
  React.useEffect(() => {
    if (defaultValues) {
      form.setValue('domain', defaultValues.domain || '');
      form.setValue('searchEngine', defaultValues.searchEngine || 'all');
      form.setValue('region', defaultValues.region || 'Москва');
      
      if (defaultValues.keywords && defaultValues.keywords.length > 0 && setKeywords) {
        setKeywords(defaultValues.keywords);
      }
    }
  }, [defaultValues, form, setKeywords]);

  const handleAddKeyword = () => {
    if (inputKeyword.trim()) {
      if (onAddKeyword) {
        onAddKeyword(inputKeyword.trim());
      } else {
        addKeywordLocal(inputKeyword.trim());
      }
      setInputKeyword('');
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    if (onRemoveKeyword) {
      onRemoveKeyword(keyword);
    } else {
      removeKeywordLocal(keyword);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Домен для проверки</Label>
          <Input
            id="domain"
            placeholder="example.com"
            {...form.register('domain')}
          />
          {form.formState.errors.domain && (
            <p className="text-sm text-red-500">{form.formState.errors.domain.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="keywords">Ключевые слова</Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => handleBulkKeywords("")}
            >
              Добавить списком
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="Введите ключевое слово"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputKeyword.trim()) {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword, i) => (
              <Badge key={i} variant="secondary" className="py-1 px-2">
                {keyword}
                <button
                  type="button"
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleKeywordRemove(keyword)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {keywords.length === 0 && (
              <p className="text-sm text-muted-foreground">Добавьте ключевые слова для проверки их позиций</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="searchEngine">Поисковая система</Label>
            <Select
              defaultValue={form.getValues('searchEngine') || "all"}
              onValueChange={(value: "google" | "yandex" | "mailru" | "all") => form.setValue('searchEngine', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите поисковую систему" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Поисковые системы</SelectLabel>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="yandex">Яндекс</SelectItem>
                  <SelectItem value="mailru">Mail.ru</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Регион</Label>
            <Select
              defaultValue={form.getValues('region') || "Москва"}
              onValueChange={(value) => form.setValue('region', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Москва">Москва</SelectItem>
                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                <SelectItem value="ru">Россия</SelectItem>
                <SelectItem value="global">Весь мир</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || keywords.length === 0}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Проверка позиций...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Проверить позиции
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
