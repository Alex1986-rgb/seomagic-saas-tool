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
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { ReviewSchema } from '@/components/seo/ReviewSchema';
import { VideoObjectSchema } from '@/components/seo/VideoObjectSchema';
import { EventSchema } from '@/components/seo/EventSchema';
import { SoftwareApplicationSchema } from '@/components/seo/SoftwareApplicationSchema';
import { CourseSchema } from '@/components/seo/CourseSchema';
import PageSeo from '@/components/seo/PageSeo';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("✅ Index page mounted successfully!");
    return () => {
      console.log("❌ Index page unmounted");
    };
  }, []);

  console.log("🎯 Index page rendering");
  
  return (
    <Layout>
      <PageSeo
        title="SEO-аудит сайта и автоматическая оптимизация онлайн"
        description="Проверьте сайт на технические и контентные ошибки, получите понятный список правок и запустите оптимизацию текстов в одном сервисе."
      />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <WebSiteSchema />
      <ServiceSchema />
      <ReviewSchema />
      <VideoObjectSchema />
      <EventSchema />
      <SoftwareApplicationSchema />
      <CourseSchema />
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
