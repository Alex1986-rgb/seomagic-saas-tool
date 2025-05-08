
import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/hero/HeroSection';
import VideoSection from '../components/home/VideoSection';
import CoreFeaturesSection from '../components/home/CoreFeaturesSection';
import PositionTrackerSection from '../components/position-tracker/PositionTrackerSection';
import DetailedFeaturesSection from '../components/home/DetailedFeaturesSection';
import CTASection from '../components/sections/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <HeroSection />
        <VideoSection />
        <CoreFeaturesSection />
        <PositionTrackerSection />
        <DetailedFeaturesSection />
        <CTASection />
      </div>
    </Layout>
  );
};

export default Index;
