
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KeywordTabs } from './KeywordTabs';
import { KeywordsList } from './KeywordsList';

interface KeywordsCardProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: (keyword?: string) => void;
  removeKeyword: (keyword: string) => void;
  keywords: string[];
  handleBulkKeywords: (text: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const KeywordsCard: React.FC<KeywordsCardProps> = ({
  inputKeyword,
  setInputKeyword,
  addKeyword,
  removeKeyword,
  keywords,
  handleBulkKeywords,
  handleFileUpload,
  isLoading
}) => {
  return (
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
  );
};
