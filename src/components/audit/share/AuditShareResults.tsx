
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { Share2 } from 'lucide-react';
import ExportDropdown from './ExportDropdown';
import SocialShareButtons from './SocialShareButtons';
import CopyLinkButton from './CopyLinkButton';
import EmailShareButton from './EmailShareButton';

interface AuditShareResultsProps {
  auditId: string;
  auditData: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
  urls?: string[];
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ 
  auditId, 
  auditData, 
  url, 
  historyItems,
  urls
}) => {
  return (
    <Card className="neo-card mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <CardTitle>Поделиться результатами</CardTitle>
        </div>
        <CardDescription>
          Экспортируйте результаты аудита в различных форматах или поделитесь ими с коллегами
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <ExportDropdown 
            auditData={auditData} 
            url={url} 
            historyItems={historyItems}
            urls={urls} 
          />
          <CopyLinkButton auditId={auditId} />
          <EmailShareButton auditId={auditId} url={url} />
          <SocialShareButtons auditId={auditId} url={url} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditShareResults;
