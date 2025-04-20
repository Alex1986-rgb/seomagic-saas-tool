
import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeywordInputProps {
  inputKeyword: string;
  setInputKeyword: (value: string) => void;
  addKeyword: () => void;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  inputKeyword,
  setInputKeyword,
  addKeyword
}) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Введите ключевое слово"
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
          }
        }}
      />
      <Button type="button" onClick={addKeyword} size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
