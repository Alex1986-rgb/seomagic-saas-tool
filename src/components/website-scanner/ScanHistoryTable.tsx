
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, BarChart, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface ScanHistoryItem {
  id: string;
  url: string;
  scanned_at: string;
  page_count: number;
  has_sitemap: boolean;
  status: 'completed' | 'failed' | 'cancelled';
}

interface ScanHistoryTableProps {
  history: ScanHistoryItem[];
  onDownloadSitemap: (id: string) => void;
  onViewReport: (id: string) => void;
  isLoading?: boolean;
}

const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({
  history,
  onDownloadSitemap,
  onViewReport,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-6 w-6 rounded-full bg-[#36CFFF]/30"></div>
        </div>
        <p className="text-[#A0A8FF] mt-2">Загрузка истории сканирований...</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="p-6 text-center border border-[#22213B] rounded-lg">
        <p className="text-[#A0A8FF]">История сканирований пуста</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Завершено</Badge>;
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-[#FFC107] border-[#FFC107]">Отменено</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <Table>
      <TableCaption>История сканирований сайтов</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#A0A8FF]">URL</TableHead>
          <TableHead className="text-[#A0A8FF]">Дата</TableHead>
          <TableHead className="text-[#A0A8FF]">Страниц</TableHead>
          <TableHead className="text-[#A0A8FF]">Статус</TableHead>
          <TableHead className="text-[#A0A8FF]">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((item) => (
          <TableRow key={item.id} className="border-[#22213B] hover:bg-[#22213B]/30">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-[#36CFFF]" />
                <span className="truncate max-w-[150px]">{item.url}</span>
              </div>
            </TableCell>
            <TableCell className="text-[#A0A8FF]">
              {formatDistanceToNow(new Date(item.scanned_at), { 
                addSuffix: true,
                locale: ru
              })}
            </TableCell>
            <TableCell className="text-white">{item.page_count}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {item.has_sitemap && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 border-[#36CFFF] text-[#36CFFF] hover:bg-[#36CFFF] hover:text-black"
                    onClick={() => onDownloadSitemap(item.id)}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                  onClick={() => onViewReport(item.id)}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScanHistoryTable;
