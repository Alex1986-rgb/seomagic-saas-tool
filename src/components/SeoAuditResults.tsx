import React from 'react';
import AuditResultsContainer from './audit/results/AuditResultsContainer';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  return <AuditResultsContainer url={url} />;
};

export default SeoAuditResults;
