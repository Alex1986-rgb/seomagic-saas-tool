
import React from 'react';
import { AuditContent as SharedAuditContent } from '@/components/audit/content';

const AuditContent = (props) => {
  return <SharedAuditContent variant="full" {...props} />;
};

export default AuditContent;
