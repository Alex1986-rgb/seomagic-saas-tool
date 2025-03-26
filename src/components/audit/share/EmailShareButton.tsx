
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EmailShareButton: React.FC = () => {
  const handleEmailShare = () => {
    const subject = encodeURIComponent("Результаты SEO аудита");
    const body = encodeURIComponent(`Посмотрите результаты SEO аудита: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={handleEmailShare}
    >
      <Mail className="h-4 w-4" />
      <span>Отправить на почту</span>
    </Button>
  );
};

export default EmailShareButton;
