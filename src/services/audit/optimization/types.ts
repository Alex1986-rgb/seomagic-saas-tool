
export interface OptimizationItem {
  type: string;
  count: number;
  pricePerUnit: number;
  totalPrice: number;
  description: string;
  name: string;
  price: number;
}

export interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

export interface OptimizationResult {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
}

export interface PageContent {
  url: string;
  content: string;
  meta: {
    description?: string;
    keywords?: string;
  };
  images: {
    src: string;
    alt?: string;
  }[];
}
