
import React from 'react';
import AuditActionButtons from './AuditActionButtons';

interface AuditHeaderProps {
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ 
  onRefresh, 
  onDeepScan, 
  isRefreshing 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Результаты SEO аудита</h2>
      <AuditActionButtons 
        onRefresh={onRefresh}
        onDeepScan={onDeepScan}
        isRefreshing={isRefreshing}
      />
    </div>
  );
};

export default AuditHeader;
