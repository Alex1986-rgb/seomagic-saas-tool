
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted animate-pulse rounded flex-1"
              />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-4 py-3">
              <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-muted/50 animate-pulse rounded flex-1"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;
