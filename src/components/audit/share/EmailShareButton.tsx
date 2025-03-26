
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmailShareButtonProps {
  url: string;
  subject: string;
  body: string;
}

const EmailShareButton: React.FC<EmailShareButtonProps> = ({ url, subject, body }) => {
  const handleEmailShare = () => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body + "\n\n" + url);
    window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`);
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
