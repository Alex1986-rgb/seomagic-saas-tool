
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CoreFeaturesSection from '@/components/home/CoreFeaturesSection';
import DetailedFeaturesSection from '@/components/home/DetailedFeaturesSection';
import PositionTrackerSection from '@/components/home/PositionTrackerSection';
import VideoSection from '@/components/home/VideoSection';
import HeroSection from '@/components/hero/HeroSection';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>SeoMarket - Профессиональный SEO аудит и оптимизация</title>
        <meta name="description" content="Комплексный инструмент для SEO аудита, оптимизации и отслеживания позиций в поисковых системах" />
      </Helmet>
      
      <HeroSection />
      <CoreFeaturesSection />
      <DetailedFeaturesSection />
      <PositionTrackerSection />
      <VideoSection />
    </>
  );
};

export default HomePage;
