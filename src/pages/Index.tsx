
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/hero/HeroSection';
import VideoSection from '@/components/home/VideoSection';
import CoreFeaturesSection from '@/components/home/CoreFeaturesSection';
import DetailedFeaturesSection from '@/components/home/DetailedFeaturesSection';
import PositionTrackerSection from '@/components/home/PositionTrackerSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

const Index: React.FC = () => {
  console.log("Index page rendering");
  
  return (
    <Layout>
      <HeroSection />
      <VideoSection />
      <CoreFeaturesSection />
      <DetailedFeaturesSection />
      <PositionTrackerSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
