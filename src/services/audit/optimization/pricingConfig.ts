
export const PRICING = {
  BASE_PRICES: {
    SMALL_SITE: 500,  // Up to 50 pages
    MEDIUM_SITE: 300, // 50-500 pages
    LARGE_SITE: 150   // 500+ pages
  },
  ITEM_PRICES: {
    META_DESCRIPTION: 50,
    META_KEYWORDS: 30,
    ALT_TAG: 20,
    UNDERSCORE_URL: 10,
    DUPLICATE_CONTENT: 200,
    CONTENT_REWRITE: 150
  },
  DISCOUNTS: {
    LARGE: { threshold: 1000, percent: 15 },
    MEDIUM: { threshold: 500, percent: 10 },
    SMALL: { threshold: 200, percent: 5 }
  }
};
