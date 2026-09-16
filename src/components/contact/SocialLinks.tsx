
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Send,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Github,
  Globe,
  ExternalLink
} from 'lucide-react';
import { SITE_CONTACTS } from '@/config/site-contacts';

/**
 * Здесь было четыре карточки соцсетей, которых у сервиса нет: Telegram,
 * YouTube, LinkedIn и Instagram со ссылкой «#» и придуманным числом
 * подписчиков (2.5K, 15K, 8.2K, 5.1K), а ниже — «30K+ подписчиков» и
 * «500+ публикаций». Ни одной такой страницы и ни одной такой цифры не
 * существовало. Теперь список строится из SITE_CONTACTS.social, счётчики
 * убраны, а пока ссылок нет — раздела соцсетей нет вовсе.
 *
 * Ниже была форма «Подпишитесь на рассылку»: поле email без состояния и
 * кнопка «Подписаться» без обработчика. Адрес никуда не уходил, рассылки
 * не существует, а человек думал, что подписался. Форму убрали.
 */
const PLATFORMS: Array<{ match: string[]; name: string; icon: typeof Send; gradient: string }> = [
  { match: ['t.me', 'telegram.'], name: 'Telegram', icon: Send, gradient: 'from-blue-500 to-blue-600' },
  { match: ['youtube.', 'youtu.be'], name: 'YouTube', icon: Youtube, gradient: 'from-red-500 to-red-600' },
  { match: ['linkedin.'], name: 'LinkedIn', icon: Linkedin, gradient: 'from-blue-700 to-blue-800' },
  { match: ['instagram.'], name: 'Instagram', icon: Instagram, gradient: 'from-pink-500 to-purple-600' },
  { match: ['facebook.'], name: 'Facebook', icon: Facebook, gradient: 'from-blue-600 to-blue-700' },
  { match: ['twitter.', 'x.com'], name: 'Twitter', icon: Twitter, gradient: 'from-sky-500 to-sky-600' },
  { match: ['github.'], name: 'GitHub', icon: Github, gradient: 'from-gray-700 to-gray-900' },
  { match: ['vk.com'], name: 'ВКонтакте', icon: Globe, gradient: 'from-blue-500 to-indigo-600' }
];

const describeLink = (url: string) => {
  const lower = url.toLowerCase();
  const known = PLATFORMS.find((platform) => platform.match.some((token) => lower.includes(token)));
  if (known) return { name: known.name, icon: known.icon, gradient: known.gradient };

  let name = url;
  try {
    name = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    // Ссылка записана без протокола — показываем как есть.
  }
  return { name, icon: Globe, gradient: 'from-primary to-secondary' };
};

const SocialLinks = () => {
  const links = SITE_CONTACTS.social;
  if (links.length === 0) return null;

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
        {links.map((url) => {
          const platform = describeLink(url);
          const Icon = platform.icon;

          return (
            <motion.div key={url} variants={itemVariants}>
              <Card className="neo-card h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="font-semibold text-lg mb-4">{platform.name}</h3>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      Подписаться
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
