
import React from 'react';
import Layout from '@/components/Layout';
import PositionPricingHero from '@/components/position-pricing/PositionPricingHero';
import PositionPricingPlans from '@/components/position-pricing/PositionPricingPlans';
import PositionPricingFeatures from '@/components/position-pricing/PositionPricingFeatures';
import PositionPricingFAQ from '@/components/position-pricing/PositionPricingFAQ';
import PositionPricingCTA from '@/components/position-pricing/PositionPricingCTA';

const PositionPricing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-32 pb-24">
        <PositionPricingHero />
        <PositionPricingPlans />
        <PositionPricingFeatures />
        <PositionPricingFAQ />
        <PositionPricingCTA />
      </div>
    </Layout>
  );
};

export default PositionPricing;
