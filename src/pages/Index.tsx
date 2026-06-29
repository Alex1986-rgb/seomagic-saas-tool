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
import { JobPostingSchema } from '@/components/seo/JobPostingSchema';
import { SEO } from '@/components/SEO';

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
      <SEO
        title="SEO-аудит сайта онлайн — проверка и оптимизация | SeoMarket"
        description="Бесплатный SEO-аудит сайта за минуту. Найдём технические ошибки, улучшим позиции в Яндекс и Google и повысим органический трафик."
        canonicalUrl="/"
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
      <JobPostingSchema />
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
