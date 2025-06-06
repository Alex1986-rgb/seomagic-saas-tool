
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/hero/HeroSection';
import VideoSection from '../components/home/VideoSection';
import CoreFeaturesSection from '../components/home/CoreFeaturesSection';
import PositionTrackerSection from '../components/position-tracker/PositionTrackerSection';
import DetailedFeaturesSection from '../components/home/DetailedFeaturesSection';
import CTASection from '../components/sections/CTASection';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("Index page mounted");
    return () => {
      console.log("Index page unmounted");
    };
  }, []);

  console.log("Index page rendering");
  
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
