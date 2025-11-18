import React from 'react';
import ScoreGaugeCard from './ScoreGaugeCard';

interface CategoryScoresGridProps {
  seoScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  previousScores?: {
    seo?: number;
    technical?: number;
    content?: number;
    performance?: number;
  };
}

const CategoryScoresGrid: React.FC<CategoryScoresGridProps> = ({
  seoScore,
  technicalScore,
  contentScore,
  performanceScore,
  previousScores
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ScoreGaugeCard
        title="SEO Score"
        score={seoScore}
        previousScore={previousScores?.seo}
        index={0}
      />
      <ScoreGaugeCard
        title="Technical Score"
        score={technicalScore}
        previousScore={previousScores?.technical}
        index={1}
      />
      <ScoreGaugeCard
        title="Content Score"
        score={contentScore}
        previousScore={previousScores?.content}
        index={2}
      />
      <ScoreGaugeCard
        title="Performance Score"
        score={performanceScore}
        previousScore={previousScores?.performance}
        index={3}
      />
    </div>
  );
};

export default CategoryScoresGrid;
