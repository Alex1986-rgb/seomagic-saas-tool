
import React from 'react';
import HeroSection from '@/components/hero';
import VideoDemo from '@/components/VideoDemo';
import FeatureSection from '@/components/features';
import DemoWorkflow from '@/components/DemoWorkflow';
import GrowthAnimation from '@/components/growth/GrowthAnimation';
import PricingSection from '@/components/sections/PricingSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import PositionTrackerFeature from '@/components/position-tracker/PositionTrackerFeature';

const Index: React.FC = () => {
  return (
    <div className="w-full pt-16 md:pt-0">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Video Demo Section */}
      <VideoDemo />
      
      {/* Position Tracker Feature Section */}
      <PositionTrackerFeature />
      
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
    </div>
  );
};

export default Index;
