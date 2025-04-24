
/**
 * Calculate SEO health score based on issues
 */
export function calculateSeoHealthScore(
  critical: number,
  important: number,
  opportunities: number,
  baseScore: number = 100
): number {
  // Weight penalties for each issue type
  const criticalPenalty = 10;
  const importantPenalty = 4;
  const opportunityPenalty = 1;
  
  // Calculate total penalty
  let totalPenalty = 
    (critical * criticalPenalty) + 
    (important * importantPenalty) + 
    (opportunities * opportunityPenalty);
  
  // Cap penalties to ensure score doesn't go below 0
  totalPenalty = Math.min(totalPenalty, baseScore);
  
  // Return final score
  return Math.max(0, baseScore - totalPenalty);
}

/**
 * Get issue impact level description
 */
export function getIssueImpactLevel(impact: number | string): string {
  if (typeof impact === 'string') {
    const lowerImpact = impact.toLowerCase();
    if (['critical', 'высокий', 'критический'].includes(lowerImpact)) return 'Критический';
    if (['high', 'высокий'].includes(lowerImpact)) return 'Высокий';
    if (['medium', 'средний'].includes(lowerImpact)) return 'Средний';
    if (['low', 'низкий'].includes(lowerImpact)) return 'Низкий';
    return impact;
  }
  
  if (typeof impact === 'number') {
    if (impact >= 90) return 'Критический';
    if (impact >= 70) return 'Высокий';
    if (impact >= 40) return 'Средний';
    return 'Низкий';
  }
  
  return 'Средний';
}

/**
 * Get SEO recommendation priority
 */
export function getRecommendationPriority(type: string): string {
  switch (type.toLowerCase()) {
    case 'critical':
    case 'критический':
      return 'Требуется немедленное исправление';
    case 'high':
    case 'высокий':
      return 'Высокий приоритет';
    case 'medium':
    case 'средний':
      return 'Средний приоритет';
    case 'low':
    case 'низкий':
      return 'Низкий приоритет';
    default:
      return 'Стандартный приоритет';
  }
}

/**
 * Calculate estimated implementation time for an issue
 */
export function getEstimatedImplementationTime(issueType: string): string {
  switch (issueType.toLowerCase()) {
    case 'meta_tags':
    case 'duplicate_title':
    case 'missing_title':
    case 'missing_description':
    case 'short_description':
      return '1-2 часа';
      
    case 'images_optimization':
    case 'missing_alt':
    case 'broken_images':
      return '2-4 часа';
      
    case 'slow_page':
    case 'performance':
      return '4-8 часов';
      
    case 'mobile_optimization':
    case 'responsive':
      return '8-16 часов';
      
    case 'broken_links':
    case 'redirect_chains':
      return '2-6 часов';
      
    default:
      return '2-4 часа';
  }
}
