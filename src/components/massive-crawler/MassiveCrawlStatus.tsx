
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCrawlStatus } from './hooks/useCrawlStatus';
import { CrawlStatusDisplay } from './components/CrawlStatusDisplay';
import { CrawlExportActions } from './components/CrawlExportActions';

interface MassiveCrawlStatusProps {
  taskId: string;
  onComplete?: (pagesScanned: number) => void;
}

export const MassiveCrawlStatus: React.FC<MassiveCrawlStatusProps> = ({
  taskId,
  onComplete
}) => {
  const { status, loading, error, fetchStatus } = useCrawlStatus(taskId);

  React.useEffect(() => {
    const checkCompletion = async () => {
      const result = await fetchStatus();
      if (result.completed && onComplete) {
        onComplete(result.pagesScanned);
      }
    };
    checkCompletion();
  }, [status?.status]);

  if (loading && !status) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <CrawlStatusDisplay status={status} />
        {status.status === 'completed' && (
          <CrawlExportActions taskId={taskId} />
        )}
      </CardContent>
    </Card>
  );
};
