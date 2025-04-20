
import React from 'react';
import { Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { KeywordInput } from './KeywordInput';

interface KeywordTabsProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: () => void;
  handleBulkKeywords: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const KeywordTabs: React.FC<KeywordTabsProps> = ({
  inputKeyword,
  setInputKeyword,
  addKeyword,
  handleBulkKeywords,
  handleFileUpload,
}) => {
  return (
    <Tabs defaultValue="single" className="w-full">
      <TabsList>
        <TabsTrigger value="single">Добавление по одному</TabsTrigger>
        <TabsTrigger value="bulk">Массовое добавление</TabsTrigger>
        <TabsTrigger value="file">Загрузка файла</TabsTrigger>
      </TabsList>

      <TabsContent value="single" className="space-y-4">
        <KeywordInput
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          addKeyword={addKeyword}
        />
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
  );
};
