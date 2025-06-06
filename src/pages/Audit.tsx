
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuditHero from '@/components/audit/AuditHero';

const Audit: React.FC = () => {
  console.log("Audit page rendering");
  
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') || '';
  
  return (
    <Layout>
      <AuditHero url={url} />
    </Layout>
  );
};

export default Audit;
