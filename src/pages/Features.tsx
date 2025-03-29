
import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import FeatureList from '@/components/features/FeatureList';

const Features: React.FC = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 heading-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Все возможности платформы
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Изучите полный набор инструментов и функций нашей SEO-платформы, разработанных для максимального повышения эффективности вашего сайта
            </motion.p>
          </motion.div>
          
          <FeatureList />
        </div>
      </section>
    </Layout>
  );
};

export default Features;
