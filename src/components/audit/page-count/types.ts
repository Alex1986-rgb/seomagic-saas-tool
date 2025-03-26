
export interface PageStatistics {
  totalPages: number;
  subpages?: Record<string, number>;
  levels?: Record<number, number>;
}

export interface PageCountDisplayProps {
  pageCount: number;
  isScanning: boolean;
  pageStats?: PageStatistics;
  onDownloadSitemap?: () => void;
}
