
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface IssuesSummaryProps {
  issues: {
    critical: number | string[];
    important: number | string[];
    opportunities: number | string[];
    minor?: number;
    passed?: number;
    technical?: number | string[];
    content?: number | string[];
    meta?: number | string[];
    links?: number | string[];
    images?: number | string[];
    performance?: number | string[];
  };
  previousIssues?: {
    critical: number;
    important: number;
    opportunities: number;
    minor?: number;
    passed?: number;
    technical?: number;
    content?: number;
    meta?: number;
    links?: number;
    images?: number;
    performance?: number;
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

  // Получение числа элементов в категории
  const getCount = (value: number | string[] | undefined): number => {
    if (Array.isArray(value)) return value.length;
    if (typeof value === 'number') return value;
    return 0;
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
          {getCount(issues.critical)}
          {getTrend(getCount(issues.critical), previousIssues?.critical)}
        </span>
      </motion.div>
      
      <motion.div 
        variants={animate ? itemVariants : undefined}
        className="flex justify-between items-center p-2 bg-amber-500/10 rounded-lg hover:bg-amber-500/15 transition-colors"
      >
        <span className="font-medium">Важные улучшения</span>
        <span className="font-bold flex items-center">
          {getCount(issues.important)}
          {getTrend(getCount(issues.important), previousIssues?.important)}
        </span>
      </motion.div>
      
      <motion.div 
        variants={animate ? itemVariants : undefined}
        className="flex justify-between items-center p-2 bg-green-500/10 rounded-lg hover:bg-green-500/15 transition-colors"
      >
        <span className="font-medium">Возможности</span>
        <span className="font-bold flex items-center">
          {getCount(issues.opportunities)}
          {getTrend(getCount(issues.opportunities), previousIssues?.opportunities)}
        </span>
      </motion.div>

      {issues.meta !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg hover:bg-blue-500/15 transition-colors"
        >
          <span className="font-medium">Мета-теги</span>
          <span className="font-bold flex items-center">
            {getCount(issues.meta)}
            {previousIssues?.meta !== undefined && getTrend(getCount(issues.meta), previousIssues.meta)}
          </span>
        </motion.div>
      )}

      {issues.images !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-purple-500/10 rounded-lg hover:bg-purple-500/15 transition-colors"
        >
          <span className="font-medium">Изображения</span>
          <span className="font-bold flex items-center">
            {getCount(issues.images)}
            {previousIssues?.images !== undefined && getTrend(getCount(issues.images), previousIssues.images)}
          </span>
        </motion.div>
      )}

      {issues.links !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-pink-500/10 rounded-lg hover:bg-pink-500/15 transition-colors"
        >
          <span className="font-medium">Ссылки</span>
          <span className="font-bold flex items-center">
            {getCount(issues.links)}
            {previousIssues?.links !== undefined && getTrend(getCount(issues.links), previousIssues.links)}
          </span>
        </motion.div>
      )}

      {issues.content !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-teal-500/10 rounded-lg hover:bg-teal-500/15 transition-colors"
        >
          <span className="font-medium">Контент</span>
          <span className="font-bold flex items-center">
            {getCount(issues.content)}
            {previousIssues?.content !== undefined && getTrend(getCount(issues.content), previousIssues.content)}
          </span>
        </motion.div>
      )}

      {issues.performance !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-orange-500/10 rounded-lg hover:bg-orange-500/15 transition-colors"
        >
          <span className="font-medium">Производительность</span>
          <span className="font-bold flex items-center">
            {getCount(issues.performance)}
            {previousIssues?.performance !== undefined && getTrend(getCount(issues.performance), previousIssues.performance)}
          </span>
        </motion.div>
      )}

      {issues.minor !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg hover:bg-blue-500/15 transition-colors"
        >
          <span className="font-medium">Незначительные проблемы</span>
          <span className="font-bold flex items-center">
            {issues.minor}
            {previousIssues?.minor !== undefined && getTrend(issues.minor, previousIssues.minor)}
          </span>
        </motion.div>
      )}

      {issues.passed !== undefined && (
        <motion.div 
          variants={animate ? itemVariants : undefined}
          className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/15 transition-colors"
        >
          <span className="font-medium">Пройденные проверки</span>
          <span className="font-bold flex items-center">
            {issues.passed}
            {previousIssues?.passed !== undefined && getTrend(issues.passed, previousIssues.passed)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IssuesSummary;
