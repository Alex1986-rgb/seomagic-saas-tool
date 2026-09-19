
import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, Handshake, Users } from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Кнопка «Стать партнером» не имела обработчика — нажатие ничего не делало,
 * заявка не уходила. Текст обещал готовую «программу партнерства» и
 * звонок менеджера. Программы с фиксированными условиями нет, поэтому говорим
 * как есть и ведём на форму связи, где обращение сохраняется.
 */
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
      description: "Условия подбираем под ваш формат работы и объём проектов."
    },
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: "Инструменты для клиентов",
      description: "Аудит сайтов, подготовка текстов для оптимизации и проверка позиций для ваших клиентов."
    }
  ];

  return (
    <Layout>
      <PageSeo
        title="Партнёрство: сотрудничество с агентствами и студиями"
        description="Форматы совместной работы для агентств, студий и фрилансеров. Расскажите о своём проекте — подберём подходящую модель сотрудничества."
      />
      <div className="container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Партнерство с SeoMarket</h1>
          <p className="text-muted-foreground mb-12">
            Мы открыты к сотрудничеству с агентствами, консультантами и специалистами по цифровому маркетингу. 
            Готовой программы с фиксированными условиями пока нет — условия обсуждаем индивидуально.
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
              Расскажите о себе и своём предложении через форму связи — 
              обращение сохранится, и мы ответим на указанную почту.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Предложить сотрудничество</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Partnership;
