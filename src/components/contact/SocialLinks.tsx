
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram,
  ExternalLink 
} from 'lucide-react';

const SocialLinks = () => {
  const socialPlatforms = [
    {
      name: "Telegram",
      icon: Send,
      url: "#",
      description: "Новости и обновления",
      followers: "2.5K",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "#",
      description: "SEO уроки и вебинары",
      followers: "15K",
      color: "bg-red-500",
      gradient: "from-red-500 to-red-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "#",
      description: "Профессиональные статьи",
      followers: "8.2K",
      color: "bg-blue-700",
      gradient: "from-blue-700 to-blue-800"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#",
      description: "Кейсы и результаты",
      followers: "5.1K",
      color: "bg-pink-500",
      gradient: "from-pink-500 to-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Мы в социальных сетях</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Следите за нашими обновлениями, получайте полезные советы по SEO 
          и будьте в курсе последних трендов цифрового маркетинга
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {socialPlatforms.map((platform, index) => (
          <motion.div key={platform.name} variants={itemVariants}>
            <Card className="neo-card h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.gradient} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <platform.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="absolute -top-1 -right-1 bg-green-100 text-green-800 text-xs">
                    {platform.followers}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {platform.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Подписаться
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Community Stats */}
      <motion.div variants={itemVariants}>
        <Card className="neo-card bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">30K+</div>
                <div className="text-sm text-muted-foreground">Подписчиков</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Публикаций</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Активность</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Поддержка</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Newsletter Signup */}
      <motion.div variants={itemVariants} className="mt-12">
        <Card className="neo-card">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Подпишитесь на рассылку</h3>
              <p className="text-muted-foreground mb-6">
                Получайте еженедельные советы по SEO и эксклюзивные материалы
              </p>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="flex-1 px-4 py-2 border border-input rounded-md bg-background"
                />
                <Button>Подписаться</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Мы не спамим. Отписаться можно в любой момент.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SocialLinks;
