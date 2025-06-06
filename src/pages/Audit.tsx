
import React from 'react';
import Layout from '@/components/Layout';
import AuditHero from '@/components/audit/AuditHero';

const Audit: React.FC = () => {
  console.log("Audit page rendering");
  
  return (
    <Layout>
      <AuditHero />
    </Layout>
  );
};

export default Audit;
