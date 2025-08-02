
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/hero/HeroSection';
import VideoSection from '../components/home/VideoSection';
import CoreFeaturesSection from '../components/home/CoreFeaturesSection';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("✅ Index page mounted successfully!");
    document.title = "SEO Аудит и Оптимизация - SeoMarket";
    
    return () => {
      console.log("❌ Index page unmounted");
    };
  }, []);

  console.log("🎯 Index page rendering");
  
  return (
    <Layout>
      <HeroSection />
      <VideoSection />
      <CoreFeaturesSection />
    </Layout>
  );
};

export default Index;
