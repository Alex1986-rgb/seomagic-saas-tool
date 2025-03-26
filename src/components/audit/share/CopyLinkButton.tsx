
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CopyLinkButtonProps {
  url: string;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ url }) => {
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на результаты аудита скопирована в буфер обмена",
    });
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={handleCopyLink}
    >
      <Copy className="h-4 w-4" />
      <span>Копировать ссылку</span>
    </Button>
  );
};

export default CopyLinkButton;
