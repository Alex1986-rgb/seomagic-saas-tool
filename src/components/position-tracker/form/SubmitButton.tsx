
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  hasKeywords: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  hasKeywords
}) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || !hasKeywords}
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
  );
};
