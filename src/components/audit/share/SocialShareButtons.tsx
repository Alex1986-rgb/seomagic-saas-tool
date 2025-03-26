
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, summary = '' }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { toast } = useToast();

  // Подготовка закодированных параметров для шеринга
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  // Функция для копирования ссылки
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setLinkCopied(true);
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка скопирована в буфер обмена"
        });
        
        setTimeout(() => {
          setLinkCopied(false);
        }, 3000);
      })
      .catch(err => {
        console.error('Не удалось скопировать: ', err);
        toast({
          title: "Ошибка",
          description: "Не удалось скопировать ссылку",
          variant: "destructive"
        });
      });
  };

  // Функции для шеринга в соцсети
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`, '_blank');
    logShareEvent('facebook');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
    logShareEvent('twitter');
  };

  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`, '_blank');
    logShareEvent('linkedin');
  };

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`;
    logShareEvent('email');
  };

  // Логирование события шеринга
  const logShareEvent = (platform: string) => {
    console.log(`Shared to ${platform}`);
    toast({
      title: "Поделились результатами",
      description: `Спасибо, что поделились результатами аудита на ${platform}!`
    });
  };

  // Анимация кнопок
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowShareOptions(!showShareOptions)}
      >
        <Share2 className="h-4 w-4" />
        <span>Поделиться</span>
      </Button>

      {showShareOptions && (
        <motion.div
          className="absolute top-full right-0 mt-2 p-3 bg-background shadow-lg rounded-lg border z-10 w-48"
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Поделиться</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowShareOptions(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <motion.div
              custom={0}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                onClick={shareToFacebook}
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
            </motion.div>
            
            <motion.div
              custom={1}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-sky-50 hover:bg-sky-100 text-sky-600 border-sky-200"
                onClick={shareToTwitter}
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
            </motion.div>
            
            <motion.div
              custom={2}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={shareToLinkedin}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </motion.div>
            
            <motion.div
              custom={3}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                onClick={shareByEmail}
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </motion.div>
            
            <motion.div
              custom={4}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={copyToClipboard}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    Копировать ссылку
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SocialShareButtons;
