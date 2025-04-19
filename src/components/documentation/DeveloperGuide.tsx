
import React from 'react';
import { motion } from 'framer-motion';
import ProjectStructure from './sections/ProjectStructure';
import LocalSetup from './sections/LocalSetup';
import ApiDocs from './sections/ApiDocs';
import ExtendingFunctionality from './sections/ExtendingFunctionality';
import TestingAndCICD from './sections/TestingAndCICD';

const DeveloperGuide: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Руководство для разработчиков</h2>
        
        <div className="space-y-8">
          <ProjectStructure />
          <LocalSetup />
          <ApiDocs />
          <ExtendingFunctionality />
          <TestingAndCICD />
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperGuide;
