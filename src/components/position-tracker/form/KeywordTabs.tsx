
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { KeywordInput } from './KeywordInput';

interface KeywordTabsProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: (keyword?: string) => void; // Updated to make keyword optional
  handleBulkKeywords: (text: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const KeywordTabs: React.FC<KeywordTabsProps> = ({
  inputKeyword,
  setInputKeyword,
  addKeyword,
  handleBulkKeywords,
  handleFileUpload,
  isLoading
}) => {
  const [bulkKeywords, setBulkKeywords] = React.useState("");

  const [activeTab, setActiveTab] = React.useState("single");

  const handleBulkSubmit = () => {
    handleBulkKeywords(bulkKeywords);
    setBulkKeywords("");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="single">По одному</TabsTrigger>
        <TabsTrigger value="bulk">Списком</TabsTrigger>
        <TabsTrigger value="file">Из файла</TabsTrigger>
      </TabsList>

      <TabsContent value="single" className="space-y-4">
        <KeywordInput 
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          addKeyword={addKeyword}
        />
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
          onClick={handleBulkSubmit}
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
  );
};
