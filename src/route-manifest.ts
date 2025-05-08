
/**
 * Route manifest for better code splitting and prefetching
 * 
 * This file helps to categorize routes by modules and define their dependencies
 * which improves code splitting and allows intelligent prefetching
 */

interface RouteDefinition {
  path: string;
  component: string;
  // Routes that should be prefetched when this route is loaded
  prefetch?: string[];
  // Bundle group this route belongs to
  group: 'core' | 'audit' | 'admin' | 'content' | 'account' | 'misc';
  // Is this a frequently accessed route?
  priority: 'high' | 'medium' | 'low';
}

export const routes: Record<string, RouteDefinition> = {
  home: {
    path: '/',
    component: '@/pages/Index',
    prefetch: ['audit', 'about', 'features'],
    group: 'core',
    priority: 'high'
  },
  audit: {
    path: '/audit',
    component: '@/pages/Audit',
    prefetch: ['site-audit'],
    group: 'audit',
    priority: 'high'
  },
  siteAudit: {
    path: '/site-audit',
    component: '@/pages/SiteAudit',
    prefetch: ['seo-optimization'],
    group: 'audit',
    priority: 'medium'
  },
  seoOptimization: {
    path: '/seo-optimization',
    component: '@/pages/SeoOptimizationPage',
    group: 'audit',
    priority: 'medium'
  },
  auditHistory: {
    path: '/audit-history',
    component: '@/pages/AuditHistory',
    group: 'audit',
    priority: 'low'
  },
  blog: {
    path: '/blog',
    component: '@/pages/Blog',
    group: 'content',
    priority: 'medium'
  },
  blogPost: {
    path: '/blog/:id',
    component: '@/pages/BlogPost',
    group: 'content',
    priority: 'low'
  },
  guides: {
    path: '/guides',
    component: '@/pages/Guides',
    group: 'content',
    priority: 'low'
  },
  guidePost: {
    path: '/guides/:id',
    component: '@/pages/GuidePost',
    group: 'content',
    priority: 'low'
  },
  features: {
    path: '/features',
    component: '@/pages/Features',
    group: 'content',
    priority: 'medium'
  },
  profile: {
    path: '/profile',
    component: '@/pages/ClientProfile',
    group: 'account',
    priority: 'medium'
  },
  dashboard: {
    path: '/dashboard',
    component: '@/pages/Dashboard',
    group: 'account',
    priority: 'high'
  },
  settings: {
    path: '/settings',
    component: '@/pages/Settings',
    group: 'account',
    priority: 'medium'
  },
  auth: {
    path: '/auth',
    component: '@/pages/Auth',
    group: 'account',
    priority: 'high'
  },
  positionTracking: {
    path: '/position-tracking',
    component: '@/pages/PositionTracking',
    group: 'audit',
    priority: 'medium'
  },
  positionPricing: {
    path: '/position-pricing',
    component: '@/pages/PositionPricing',
    group: 'misc',
    priority: 'low'
  },
  reports: {
    path: '/reports',
    component: '@/pages/Reports',
    group: 'audit',
    priority: 'medium'
  },
  about: {
    path: '/about',
    component: '@/pages/About',
    group: 'content',
    priority: 'medium'
  },
  pricing: {
    path: '/pricing',
    component: '@/pages/Pricing',
    group: 'misc',
    priority: 'medium'
  },
  support: {
    path: '/support',
    component: '@/pages/Support',
    group: 'misc',
    priority: 'low'
  },
  contact: {
    path: '/contact',
    component: '@/pages/Contact',
    group: 'misc',
    priority: 'low'
  },
  demo: {
    path: '/demo',
    component: '@/pages/Demo',
    group: 'misc',
    priority: 'medium'
  },
  privacy: {
    path: '/privacy',
    component: '@/pages/Privacy',
    group: 'misc',
    priority: 'low'
  },
  terms: {
    path: '/terms',
    component: '@/pages/Terms',
    group: 'misc',
    priority: 'low'
  },
  documentation: {
    path: '/documentation',
    component: '@/pages/Documentation',
    group: 'content',
    priority: 'low'
  },
  admin: {
    path: '/admin',
    component: '@/routes/AdminRoutes',
    group: 'admin',
    priority: 'medium'
  }
};

/**
 * Helper function to get routes by their group
 */
export const getRoutesByGroup = (group: string): RouteDefinition[] => {
  return Object.values(routes).filter(route => route.group === group);
};

/**
 * Helper function to get high priority routes
 */
export const getHighPriorityRoutes = (): RouteDefinition[] => {
  return Object.values(routes).filter(route => route.priority === 'high');
};

/**
 * Helper function to prefetch routes based on the current route
 */
export const prefetchRelatedRoutes = (currentPath: string): void => {
  const currentRoute = Object.values(routes).find(route => route.path === currentPath);
  if (!currentRoute || !currentRoute.prefetch) return;
  
  // Find the related routes that should be prefetched
  const routesToPrefetch = currentRoute.prefetch.map(routeKey => routes[routeKey]);
  
  // In a real implementation, here you would import the related components
  console.log(`Prefetching routes for ${currentPath}:`, routesToPrefetch.map(r => r.path));
  
  // Example implementation:
  // routesToPrefetch.forEach(route => {
  //   import(/* @vite-ignore */ route.component).catch(err => {
  //     console.warn(`Failed to prefetch ${route.path}:`, err);
  //   });
  // });
};
