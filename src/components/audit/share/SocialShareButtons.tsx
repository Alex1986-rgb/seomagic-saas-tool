
import React from 'react';
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Facebook, MessageCircle, Share } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title?: string;
  summary?: string;
  auditId?: string;
  shareUrl?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  url, 
  title = `SEO аудит для ${url}`,
  summary = `Результаты SEO аудита для ${url}`,
  shareUrl,
  auditId
}) => {
  const handleTwitterShare = () => {
    const shareLink = shareUrl || url;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };
  
  const handleFacebookShare = () => {
    const shareLink = shareUrl || url;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };
  
  const handleLinkedInShare = () => {
    const shareLink = shareUrl || url;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };
  
  const handleTelegramShare = () => {
    const shareLink = shareUrl || url;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  };
  
  const handleWhatsAppShare = () => {
    const shareLink = shareUrl || url;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareLink)}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={handleTwitterShare}
        aria-label="Поделиться в Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={handleFacebookShare}
        aria-label="Поделиться в Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={handleLinkedInShare}
        aria-label="Поделиться в LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={handleTelegramShare}
        aria-label="Поделиться в Telegram"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full" 
        onClick={handleWhatsAppShare}
        aria-label="Поделиться в WhatsApp"
      >
        <Share className="h-4 w-4" />
      </Button>
    </>
  );
};

export default SocialShareButtons;
