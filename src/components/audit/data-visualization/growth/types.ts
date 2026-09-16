
export interface BeforeAfterDataPoint {
  category: string;
  before: number;
  after: number;
}

export interface GrowthVisualizationData {
  overview: BeforeAfterDataPoint[];
  /**
   * Разбивки по SEO и скорости показываем, только когда есть что сравнивать.
   * Раньше сюда передавали заготовленные числа, одинаковые для любого сайта.
   */
  seo?: BeforeAfterDataPoint[];
  performance?: BeforeAfterDataPoint[];
}

export interface GrowthVisualizationProps {
  beforeAfterData: GrowthVisualizationData;
}

export interface TabContentProps {
  data: BeforeAfterDataPoint[];
  title: string;
  chartType: 'area' | 'bar';
}
