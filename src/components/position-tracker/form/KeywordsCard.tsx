
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { KeywordTabs } from './KeywordTabs';
import { KeywordsList } from './KeywordsList';

interface KeywordsCardProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: (keyword?: string) => void;
  addMultipleKeywords?: (keywords: string[]) => void;
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
  addMultipleKeywords,
  removeKeyword,
  keywords,
  handleBulkKeywords,
  handleFileUpload,
  isLoading
}) => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">Ключевые слова</CardTitle>
        <CardDescription>
          Добавьте ключевые слова для проверки позиций
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <KeywordTabs
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          addKeyword={addKeyword}
          addMultipleKeywords={addMultipleKeywords}
          handleBulkKeywords={handleBulkKeywords}
          handleFileUpload={handleFileUpload}
          isLoading={isLoading}
        />

        {keywords.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Добавленные ключевые слова ({keywords.length})</h3>
            <KeywordsList 
              keywords={keywords} 
              removeKeyword={(index) => removeKeyword(keywords[index])}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
