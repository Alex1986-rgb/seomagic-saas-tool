
import React, { useEffect } from 'react';
import { useProject } from '@/hooks/useProject';
import { AnalyticsOverview } from './AnalyticsOverview';
import { Skeleton } from "@/components/ui/skeleton";

const DashboardAnalyticsTab: React.FC = () => {
  const { project } = useProject();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Аналитика</h2>
      </div>
      {project ? (
        <AnalyticsOverview projectId={project.id} />
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAnalyticsTab;
