
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
    console.log("Index page mounted - WORKING!");
    document.title = "SEO Аудит и Оптимизация - SeoMarket";
    
    // Ensure body has white background
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
    
    return () => {
      console.log("Index page unmounted");
    };
  }, []);

  console.log("Index page rendering - VISIBLE!");
  
  return (
    <Layout>
      <div style={{ 
        backgroundColor: '#ffffff', 
        minHeight: '100vh', 
        color: '#000000' 
      }}>
        {/* Temporary visible content for debugging */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f9f9f9', 
          border: '1px solid #ddd',
          margin: '20px'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
            🎉 Сайт работает! Загрузка компонентов...
          </h1>
          <p style={{ fontSize: '16px' }}>
            Если вы видите этот текст, значит React приложение загружается корректно.
          </p>
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
