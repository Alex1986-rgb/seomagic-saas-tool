
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormLabel } from "@/components/ui/form";

interface KeywordsListProps {
  keywords: string[];
  removeKeyword: (index: number) => void;
}

export const KeywordsList: React.FC<KeywordsListProps> = ({
  keywords,
  removeKeyword
}) => {
  return (
    <div className="mt-4">
      <FormLabel>Добавленные ключевые слова ({keywords.length})</FormLabel>
      <Card className="mt-2">
        <CardContent className="p-4 max-h-[250px] overflow-y-auto">
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 py-2">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Добавьте ключевые слова для проверки позиций
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
