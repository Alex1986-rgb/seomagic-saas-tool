
import React from 'react';
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
      <div className="container px-4 py-16 mx-auto">
        <AboutHero />
        <MissionSection />
        <FeaturesSection />
        <TeamSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </Layout>
  );
};

export default About;
