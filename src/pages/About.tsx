import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import FeaturesSection from '@/components/about/FeaturesSection';
import CtaSection from '@/components/about/CtaSection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import PageSeo from '@/components/seo/PageSeo';

const About = () => {
  return (
    <Layout>
      <PageSeo
        title="О сервисе: как устроены наш SEO-аудит и оптимизация"
        description="Чем занимается платформа, как устроены автоматический аудит сайта, ИИ-оптимизация и проверка позиций в поиске."
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'О нас', url: '/about' }
      ]} />
      <LocalBusinessSchema />
      <OrganizationSchema />
      {/*
        Блоки «Наша команда» и «Отзывы» (TeamSection, TestimonialsSection) и
        разметка ReviewSchema убраны со страницы: люди и отзывы в них были
        выдуманы, сами компоненты уже ничего не выводили, а разделители вокруг
        них давали двойные линии. Вернуть — когда появятся настоящие состав
        команды и отзывы с согласием авторов.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-8 mx-auto relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent -z-10" />
        <AboutHero />
        <div className="elegant-divider" />
        <MissionSection />
        <div className="elegant-divider-alt" />
        <FeaturesSection />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default About;
