
export interface BeforeAfterDataPoint {
  category: string;
  before: number;
  after: number;
}

export interface GrowthVisualizationData {
  performance: BeforeAfterDataPoint[];
  seo: BeforeAfterDataPoint[];
  overview: BeforeAfterDataPoint[];
}

export interface GrowthVisualizationProps {
  beforeAfterData: GrowthVisualizationData;
}

export interface TabContentProps {
  data: BeforeAfterDataPoint[];
  title: string;
  chartType: 'area' | 'bar';
}
