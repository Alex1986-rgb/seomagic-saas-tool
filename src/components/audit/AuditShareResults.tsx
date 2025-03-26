
import React from 'react';
import { Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AuditShareResults: React.FC = () => {
  const { toast } = useToast();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на результаты аудита скопирована в буфер обмена",
    });
  };
  
  return (
    <div className="text-center">
      <button 
        className="inline-flex items-center gap-2 text-primary hover:underline"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>Поделиться результатами</span>
      </button>
    </div>
  );
};

export default AuditShareResults;
