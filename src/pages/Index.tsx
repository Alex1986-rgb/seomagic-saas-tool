
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/hero';
import VideoDemo from '@/components/VideoDemo';
import FeatureSection from '@/components/FeatureSection';
import DemoWorkflow from '@/components/DemoWorkflow';
import GrowthAnimation from '@/components/growth/GrowthAnimation';
import PricingSection from '@/components/sections/PricingSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Video Demo Section */}
      <VideoDemo />
      
      {/* Growth Animation Section */}
      <GrowthAnimation />
      
      {/* Feature Section */}
      <FeatureSection />
      
      {/* Demo Workflow Section */}
      <DemoWorkflow />
      
      {/* Pricing Information Section */}
      <PricingSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
