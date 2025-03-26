
export interface BeforeAfterData {
  category: string;
  before: number;
  after: number;
}

export interface AnimatedGrowthChartProps {
  title: string;
  data: BeforeAfterData[];
  chartType?: 'area' | 'bar';
}
