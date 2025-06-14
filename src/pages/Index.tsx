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
    console.log("✅ Index page mounted successfully!");
    document.title = "SEO Аудит и Оптимизация - SeoMarket";
    
    // Force white background
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    return () => {
      console.log("❌ Index page unmounted");
    };
  }, []);

  console.log("🎯 Index page rendering NOW!");
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#000000',
      width: '100%'
    }}>
      {/* Emergency visible content */}
      <div style={{
        position: 'fixed',
        top: '50px',
        left: '0',
        right: '0',
        background: '#00ff00',
        color: '#000000',
        padding: '20px',
        textAlign: 'center',
        zIndex: 9998,
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        ✅ ГЛАВНАЯ СТРАНИЦА ЗАГРУЖАЕТСЯ! Если вы видите это - React работает!
      </div>
      
      <Layout>
        <div style={{ 
          backgroundColor: '#ffffff', 
          minHeight: '100vh', 
          color: '#000000',
          paddingTop: '120px'
        }}>
          {/* Main content with forced visibility */}
          <div style={{ 
            padding: '40px', 
            backgroundColor: '#f0f0f0', 
            border: '3px solid #ff0000',
            margin: '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '32px', 
              marginBottom: '20px',
              color: '#000000'
            }}>
              🎉 САЙТ РАБОТАЕТ ПРАВИЛЬНО!
            </h1>
            <p style={{ 
              fontSize: '18px',
              color: '#333333'
            }}>
              Если вы видите этот текст, значит React приложение загружается корректно.
              Сейчас загружаются остальные компоненты...
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
    </div>
  );
};

export default Index;
