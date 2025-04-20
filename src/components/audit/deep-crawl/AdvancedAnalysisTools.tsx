
import React from 'react';
import SiteStructureAnalysis from './components/SiteStructureAnalysis';

interface AdvancedAnalysisToolsProps {
  domain: string;
  urls: string[];
}

const AdvancedAnalysisTools: React.FC<AdvancedAnalysisToolsProps> = ({ domain, urls }) => {
  return (
    <div className="space-y-6">
      <SiteStructureAnalysis domain={domain} urls={urls} />
    </div>
  );
};

export default AdvancedAnalysisTools;
