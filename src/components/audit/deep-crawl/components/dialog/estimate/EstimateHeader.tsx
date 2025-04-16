
import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EstimateHeaderProps {
  pagesScanned: number;
}

const EstimateHeader: React.FC<EstimateHeaderProps> = ({ pagesScanned }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Смета на оптимизацию</h3>
      </div>
      <Badge variant="outline">{pagesScanned} страниц</Badge>
    </div>
  );
};

export default EstimateHeader;
