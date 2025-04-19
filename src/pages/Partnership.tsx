
import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Briefcase, Handshake, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  const partnershipBenefits = [
    {
      icon: <Handshake className="h-10 w-10 text-primary mb-4" />,
      title: "Стратегическое партнерство",
      description: "Совместная работа для достижения максимальных результатов в SEO-продвижении и цифровом маркетинге."
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary mb-4" />,
      title: "Взаимовыгодное сотрудничество",
      description: "Программы, направленные на развитие бизнеса и расширение возможностей наших партнеров."
    },
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: "Поддержка и развитие",
      description: "Предоставление экспертной поддержки, инструментов и ресурсов для успешного развития вашего бизнеса."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Партнерство с SeoMarket</h1>
          <p className="text-muted-foreground mb-12">
            Мы ищем амбициозных партнеров, готовых развивать бизнес вместе с нами. 
            Наша программа партнерства создана для агентств, консультантов и специалистов по цифровому маркетингу.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {partnershipBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-card/30 p-6 rounded-lg border border-border text-center hover:shadow-lg transition-all"
              >
                {benefit.icon}
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Хотите стать нашим партнером?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Мы открыты к сотрудничеству и готовы рассмотреть ваши предложения. 
              Заполните форму связи, и наш менеджер свяжется с вами в ближайшее время.
            </p>
            <Button size="lg">Стать партнером</Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Partnership;
