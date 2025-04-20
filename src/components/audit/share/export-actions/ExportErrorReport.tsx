
import React from 'react';
import { ExportAction } from './ExportAction';
import { useAuditAPI } from '../../results/hooks/useAuditAPI';
import { FileWarning } from 'lucide-react';

interface ExportErrorReportProps {
  taskId: string;
  className?: string;
}

const ExportErrorReport: React.FC<ExportErrorReportProps> = ({ taskId, className }) => {
  const { downloadReport, isDownloading } = useAuditAPI();

  const handleExport = async () => {
    if (!taskId) return;
    await downloadReport(taskId, 'errors');
  };

  return (
    <ExportAction
      icon={<FileWarning className="w-4 h-4" />}
      label="Отчет об ошибках"
      onClick={handleExport}
      loading={isDownloading}
      className={className}
    />
  );
};

export default ExportErrorReport;
