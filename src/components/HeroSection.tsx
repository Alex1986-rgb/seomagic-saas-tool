
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileText, Globe, Tool } from 'lucide-react';
import UrlForm from './UrlForm';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Optimize Your Site With <span className="text-primary">Professional SEO</span> Audit
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SeoMarket analyzes your website, generates instant reports, and provides optimized copies with enhanced SEO.
          </motion.p>
          
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <UrlForm />
          </motion.div>
          
          <motion.div 
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <FeatureItem 
              icon={<Search size={24} />}
              text="Get SEO Analysis" 
            />
            <FeatureItem 
              icon={<FileText size={24} />}
              text="PDF Report" 
            />
            <FeatureItem 
              icon={<Tool size={24} />}
              text="Fix Issues Automatically" 
            />
            <FeatureItem 
              icon={<Globe size={24} />}
              text="Optimized Site Copy" 
            />
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <div className="p-3 bg-primary/10 text-primary rounded-full">
        {icon}
      </div>
      <p className="text-sm md:text-base font-medium text-center">{text}</p>
    </div>
  );
};

export default HeroSection;
