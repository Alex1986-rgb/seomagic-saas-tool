
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import FeaturesSection from '@/components/about/FeaturesSection';
import TeamSection from '@/components/about/TeamSection';
import TestimonialsSection from '@/components/about/TestimonialsSection';
import CtaSection from '@/components/about/CtaSection';

const About = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-16 mx-auto"
      >
        <AboutHero />
        <MissionSection />
        <FeaturesSection />
        <TeamSection />
        <TestimonialsSection />
        <CtaSection />
      </motion.div>
    </Layout>
  );
};

export default About;
