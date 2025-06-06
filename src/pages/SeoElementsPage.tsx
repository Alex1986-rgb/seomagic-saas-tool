
import React from 'react';
import Layout from '@/components/Layout';
import SeoElementsOptimizer from '@/components/seo-optimization/SeoElementsOptimizer';

const SeoElementsPage: React.FC = () => {
  console.log("SeoElementsPage rendering");
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SeoElementsOptimizer />
      </div>
    </Layout>
  );
};

export default SeoElementsPage;
