
import React from 'react';
import { motion } from 'framer-motion';
import Registration from './sections/user-guide/Registration';
import SeoAudit from './sections/user-guide/SeoAudit';
import ReportAnalysis from './sections/user-guide/ReportAnalysis';

const UserGuide: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Руководство пользователя</h2>
        <div className="space-y-8">
          <Registration />
          <SeoAudit />
          <ReportAnalysis />
        </div>
      </motion.div>
    </div>
  );
};

export default UserGuide;
