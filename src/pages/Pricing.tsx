
import React from 'react';
import Layout from '@/components/Layout';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-32 pb-24">
        <PricingHero />
        <PricingPlans />
        <FeatureComparison />
        <PricingFAQ />
        <PricingCTA />
      </div>
    </Layout>
  );
};

export default Pricing;
