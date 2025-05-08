
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface IssuesSummaryProps {
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
  previousIssues?: {
    critical: number;
    important: number;
    opportunities: number;
  };
  animate?: boolean;
}

const IssuesSummary: React.FC<IssuesSummaryProps> = ({ 
  issues, 
  previousIssues,
  animate = true 
}) => {
  // Определение тренда для каждой категории
  const getTrend = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    
    if (current > previous) return <ArrowUp className="h-4 w-4 ml-1 text-red-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 ml-1 text-green-500" />;
    return <Minus className="h-4 w-4 ml-1 text-amber-500" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: 'spring' }
    }
  };

  return (
    <motion.div 
      className="space-y-2"
      variants={animate ? containerVariants : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "show" : undefined}
    >
      <motion.div 
        variants={animate ? itemVariants : undefined}
        className="flex justify-between items-center p-2 bg-red-500/10 rounded-lg hover:bg-red-500/15 transition-colors"
      >
        <span className="font-medium">Критические ошибки</span>
        <span className="font-bold flex items-center">
          {issues.critical}
          {getTrend(issues.critical, previousIssues?.critical)}
        </span>
      </motion.div>
      
      <motion.div 
        variants={animate ? itemVariants : undefined}
        className="flex justify-between items-center p-2 bg-amber-500/10 rounded-lg hover:bg-amber-500/15 transition-colors"
      >
        <span className="font-medium">Важные улучшения</span>
        <span className="font-bold flex items-center">
          {issues.important}
          {getTrend(issues.important, previousIssues?.important)}
        </span>
      </motion.div>
      
      <motion.div 
        variants={animate ? itemVariants : undefined}
        className="flex justify-between items-center p-2 bg-green-500/10 rounded-lg hover:bg-green-500/15 transition-colors"
      >
        <span className="font-medium">Возможности</span>
        <span className="font-bold flex items-center">
          {issues.opportunities}
          {getTrend(issues.opportunities, previousIssues?.opportunities)}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default IssuesSummary;
