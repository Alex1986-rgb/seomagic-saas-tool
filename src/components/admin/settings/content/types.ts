
export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
  features: Array<{
    title: string;
    description: string;
    isVisible: boolean;
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    isVisible: boolean;
  };
}

export interface AuditPageContent {
  title: string;
  description: string;
  placeholderText: string;
  buttonText: string;
  tips: Array<{
    text: string;
    isVisible: boolean;
  }>;
}
