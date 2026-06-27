
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewAudit = () => {
    navigate('/audit');
  };

  // Навигация по разделам — через рабочие вкладки DashboardTabs
  // (прежний сайдбар DashboardLayout был инертен и удалён).
  return (
    <div className="container py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader onNewAudit={handleNewAudit} />
        <DashboardTabs defaultTab="overview" />
      </motion.div>
    </div>
  );
};

export default Dashboard;
