
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

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
  addMultipleKeywords,
}) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputKeyword.trim()) {
        // Check if the input contains multiple keywords (comma or semicolon separated)
        if (inputKeyword.includes(',') || inputKeyword.includes(';')) {
          handleMultipleKeywords();
        } else {
          addKeyword(inputKeyword);
          setInputKeyword('');
        }
      }
    }
  };
  
  // Handle comma or semicolon separated keywords
  const handleMultipleKeywords = () => {
    if (!addMultipleKeywords) return;
    
    const keywords = inputKeyword
      .split(/[,;]+/)
      .map(k => k.trim())
      .filter(k => k !== '');
      
    if (keywords.length > 0) {
      addMultipleKeywords(keywords);
      setInputKeyword('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input 
          placeholder="Введите ключевое слово"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        type="button"
        onClick={() => {
          if (inputKeyword.trim()) {
            if (inputKeyword.includes(',') || inputKeyword.includes(';')) {
              handleMultipleKeywords();
            } else {
              addKeyword(inputKeyword);
              setInputKeyword('');
            }
          }
        }}
        disabled={!inputKeyword.trim()}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Добавить
      </Button>
    </div>
  );
};
