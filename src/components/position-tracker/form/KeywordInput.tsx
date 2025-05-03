
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface KeywordInputProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: (keyword?: string) => void;
  addMultipleKeywords?: (keywords: string[]) => void;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  inputKeyword,
  setInputKeyword,
  addKeyword,
  addMultipleKeywords
}) => {
  const [isMultiline, setIsMultiline] = useState(false);

  const handleAddKeyword = () => {
    if (!isMultiline) {
      // Add single keyword
      addKeyword(inputKeyword);
    } else if (addMultipleKeywords && inputKeyword) {
      // Split by newlines, commas, or semicolons and filter empty entries
      const keywordList = inputKeyword
        .split(/[\n,;]+/)
        .map(kw => kw.trim())
        .filter(kw => kw.length > 0);
      
      if (keywordList.length > 0) {
        addMultipleKeywords(keywordList);
      }
    }
  };

  const toggleInputMode = () => {
    setIsMultiline(!isMultiline);
    setInputKeyword('');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={toggleInputMode}
          className="text-xs"
        >
          {isMultiline ? "Одно ключевое слово" : "Несколько ключевых слов"}
        </Button>
      </div>

      <div className="flex gap-2">
        {!isMultiline ? (
          <Input
            placeholder="Введите ключевое слово"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
          />
        ) : (
          <Textarea
            placeholder="Введите несколько ключевых слов (разделяйте запятыми, точкой с запятой или новой строкой)"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            className="min-h-[100px]"
          />
        )}
        <Button type="button" onClick={handleAddKeyword} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {isMultiline && (
        <p className="text-xs text-muted-foreground">
          Нажмите Ctrl+Enter или кнопку + для добавления всех ключевых слов
        </p>
      )}
    </div>
  );
};
