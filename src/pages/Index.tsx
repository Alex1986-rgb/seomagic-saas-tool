
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import HeroSection from '@/components/hero/HeroSection';
import FeatureGrid from '@/components/hero/FeatureGrid';
import CTASection from '@/components/sections/CTASection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <HeroSection />
      <FeatureGrid />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
