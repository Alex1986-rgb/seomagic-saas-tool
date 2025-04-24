
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  highlight: boolean;
}

export interface PageSettings {
  title: string;
  subtitle: string;
  layout: string;
  showIcons: boolean;
}
