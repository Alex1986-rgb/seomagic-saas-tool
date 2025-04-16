
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleNewAudit = () => {
    navigate('/audit');
  };
  
  return (
    <div className="container py-6 md:py-10">
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader onNewAudit={handleNewAudit} />
          <DashboardTabs defaultTab="overview" />
        </motion.div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
