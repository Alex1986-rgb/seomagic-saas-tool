
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EmailShareButtonProps {
  url: string;
  subject: string;
  body: string;
}

const EmailShareButton: React.FC<EmailShareButtonProps> = ({ url, subject, body }) => {
  const { toast } = useToast();
  
  const handleEmailShare = () => {
    try {
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n' + url)}`;
      window.location.href = mailtoUrl;
      
      toast({
        title: "Открывается приложение почты",
        description: "Подготовлено письмо с результатами аудита",
      });
    } catch (error) {
      console.error('Ошибка при отправке по email:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось открыть почтовое приложение",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2" 
      onClick={handleEmailShare}
    >
      <Mail className="h-4 w-4" />
      <span>Отправить по Email</span>
    </Button>
  );
};

export default EmailShareButton;
