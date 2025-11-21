import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/hero/HeroSection';
import VideoSection from '../components/home/VideoSection';
import CoreFeaturesSection from '../components/home/CoreFeaturesSection';
import PositionTrackerSection from '../components/position-tracker/PositionTrackerSection';
import DetailedFeaturesSection from '../components/home/DetailedFeaturesSection';
import CTASection from '../components/sections/CTASection';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';

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
      <LocalBusinessSchema />
      <OrganizationSchema />
      <WebSiteSchema />
      <HeroSection />
      <VideoSection />
      <CoreFeaturesSection />
      <PositionTrackerSection />
      <DetailedFeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
