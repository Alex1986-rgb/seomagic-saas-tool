import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import FeaturesSection from '@/components/about/FeaturesSection';
import TeamSection from '@/components/about/TeamSection';
import TestimonialsSection from '@/components/about/TestimonialsSection';
import CtaSection from '@/components/about/CtaSection';
import { Separator } from '@/components/ui/separator';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const About = () => {
  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'О нас', url: '/about' }
      ]} />
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
        <div className="elegant-divider" />
        <TeamSection />
        <div className="elegant-divider-alt" />
        <TestimonialsSection />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default About;
