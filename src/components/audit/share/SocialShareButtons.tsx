
import React from 'react';
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Facebook } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  summary: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, summary }) => {
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };
  
  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
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
    </>
  );
};

export default SocialShareButtons;
