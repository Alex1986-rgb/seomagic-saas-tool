
import React from 'react';
import Layout from '@/components/Layout';
import Features from '@/components/features';

const FeaturesPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <Features />
      </div>
    </Layout>
  );
};

export default FeaturesPage;
