
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

export interface AboutPageContent {
  title: string;
  subtitle: string;
  sections: Array<{
    title: string;
    content: string;
    isVisible: boolean;
  }>;
  team: Array<{
    name: string;
    position: string;
    photo: string;
    isVisible: boolean;
  }>;
}

export interface ContactPageContent {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  mapEmbed: string;
  formFields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    isVisible: boolean;
  }>;
}

export interface PricingPlanContent {
  plans: Array<{
    name: string;
    price: number;
    period: string;
    features: string[];
    isRecommended: boolean;
    buttonText: string;
    isVisible: boolean;
  }>;
  comparisons: Array<{
    feature: string;
    basic: boolean;
    pro: boolean;
    enterprise: boolean;
  }>;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    templates: Array<{
      name: string;
      subject: string;
      content: string;
      isEnabled: boolean;
    }>;
  };
  site: {
    enabled: boolean;
    notifications: Array<{
      title: string;
      content: string;
      type: 'info' | 'success' | 'warning' | 'error';
      isEnabled: boolean;
    }>;
  };
}
