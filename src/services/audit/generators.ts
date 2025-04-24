import { AuditData } from "@/types/audit/audit-core";
import { AuditDetailsData } from "@/types/audit/audit-details";
import { CategoryData } from "@/types/audit/category-data";
import { PageData } from "@/types/audit/page-data";
import { generateRandomId } from "@/utils";
import { AuditItemData } from '@/types/audit/audit-items';

const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 100);
};

const generateCategoryData = (seed: number): CategoryData => {
  return {
    score: Math.floor(seed * 100) % 100,
    passed: Math.floor((1 - seed) * 20) + 10,
    warning: Math.floor(seed * 15) + 5,
    failed: Math.floor((1 - seed) * 10),
    items: generateAuditItems(seed),
  };
};

const generateAuditDetails = (seed: number): AuditDetailsData => {
  return {
    seo: generateCategoryData(seed * 0.8),
    content: generateCategoryData(seed * 0.5),
    performance: generateCategoryData(seed * 0.7),
    technical: generateCategoryData(seed * 0.9),
    mobile: generateCategoryData(seed * 0.6),
    usability: generateCategoryData(seed * 0.4),
  };
};

const generateAuditItems = (seed: number): AuditItemData[] => {
  const itemCount = Math.floor(seed * 5) + 3;
  return Array.from({ length: itemCount }, (_, i) => ({
    id: generateRandomId(),
    title: `Audit Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    status: ['error', 'warning', 'good'][i % 3] as 'error' | 'warning' | 'good',
    score: Math.floor(seed * 80) + 20,
    trend: ['up', 'down', 'neutral'][i % 3] as 'up' | 'down' | 'neutral',
    impact: ['high', 'medium', 'low'][i % 3] as 'high' | 'medium' | 'low',
  }));
};

const generatePageData = (url: string): PageData => {
  return {
    url: url,
    title: `Page Title for ${url}`,
    meta: {
      description: `Meta description for ${url}`,
      keywords: `keywords for ${url}`,
    },
  };
};

const generateIssues = (seed: number) => {
  const criticalCount = Math.floor(seed * 3) % 5;
  const importantCount = Math.floor(seed * 7) % 8;
  const opportunitiesCount = Math.floor(seed * 5) % 10;

  return {
    critical: Array.from({ length: criticalCount }, (_, i) => `Critical issue ${i + 1}`),
    important: Array.from({ length: importantCount }, (_, i) => `Important issue ${i + 1}`),
    opportunities: Array.from({ length: opportunitiesCount }, (_, i) => `Opportunity ${i + 1}`),
    minor: Math.floor(seed * 9) % 10,
    passed: Math.floor((1 - seed) * 20) + 10
  };
};

export const generateAuditData = (url: string): AuditData => {
  const seed = Math.random();
  const pageCount = Math.floor(seed * 100) + 10;
  const score = generateRandomScore();
  
  return {
    id: generateRandomId(),
    url: url,
    title: `Audit for ${url}`,
    score: score,
    previousScore: score - 10,
    pageCount: pageCount,
    crawledPages: pageCount - 5,
    date: new Date().toISOString(),
    status: 'completed',
    issues: generateIssues(seed),
    details: generateAuditDetails(seed),
  };
};
