
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
  cellClassName?: string;
  headerClassName?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className,
  showHeader = true,
  cellClassName,
  headerClassName
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          {showHeader && (
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors">
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={`header-${i}`} className={cn("h-12 px-4 text-left align-middle font-medium", headerClassName)}>
                    <Skeleton className="h-4 w-[80%]" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-b transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} className={cn("p-4 align-middle", cellClassName)}>
                    <Skeleton className={cn("h-4", colIndex === 0 ? "w-[60%]" : "w-[80%]")} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
