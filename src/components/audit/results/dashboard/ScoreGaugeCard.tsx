import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreGaugeCardProps {
  title: string;
  score: number;
  previousScore?: number;
  index: number;
}

const ScoreGaugeCard: React.FC<ScoreGaugeCardProps> = ({
  title,
  score,
  previousScore,
  index
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(var(--success))';
    if (score >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getTrend = () => {
    if (!previousScore) return null;
    if (score > previousScore) return <TrendingUp className="h-4 w-4 text-success" />;
    if (score < previousScore) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            {title}
            {getTrend()}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                stroke={getScoreColor(score)}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-bold"
                style={{ color: getScoreColor(score) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-muted-foreground">из 100</span>
            </div>
          </div>
          {previousScore && (
            <div className="text-xs text-muted-foreground mt-2">
              Было: {previousScore}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreGaugeCard;
