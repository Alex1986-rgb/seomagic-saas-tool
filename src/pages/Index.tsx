
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
    console.log("Index page mounted - DEBUGGING");
    document.title = "SEO Аудит и Оптимизация - SeoMarket";
    
    // Debug: Check if DOM elements are being created
    setTimeout(() => {
      const rootElement = document.getElementById('root');
      console.log("Root element:", rootElement);
      console.log("Root children count:", rootElement?.children.length);
    }, 1000);
    
    return () => {
      console.log("Index page unmounted - DEBUGGING");
    };
  }, []);

  console.log("Index page rendering - DEBUGGING");
  
  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'red', minHeight: '100px' }}>
        <div style={{ backgroundColor: 'blue', color: 'white', padding: '20px', margin: '10px' }}>
          DEBUG: If you see this blue box, React is rendering correctly
        </div>
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
