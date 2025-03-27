
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
  // Prepare share data
  const shareUrl = `${window.location.origin}/audit?url=${encodeURIComponent(url)}`;
  const shareTitle = `Результаты SEO аудита для ${url}`;
  const shareSummary = `Общий балл: ${auditData.score}/100. Проверено: ${new Date(auditData.date).toLocaleDateString()}.`;
  
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
          <CopyLinkButton url={shareUrl} />
          <EmailShareButton 
            url={shareUrl} 
            subject={shareTitle}
            body={shareSummary}
          />
          <SocialShareButtons 
            url={shareUrl} 
            title={shareTitle}
            summary={shareSummary}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditShareResults;
