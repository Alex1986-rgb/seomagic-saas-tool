
import React from 'react';
import { AuditContent as SharedAuditContent } from '@/components/audit/content';

const AuditContent = (props) => {
  return <SharedAuditContent variant="minimal" {...props} />;
};

export default AuditContent;
