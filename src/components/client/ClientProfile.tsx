
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('audits');

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileHeader />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              <ProfileSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              
              {/* Содержимое вкладок рисовалось дважды (отдельно для телефона и
                  для компьютера, разметка при этом одинаковая): каждая вкладка
                  ходила в базу по два раза, а у формы настроек было две копии. */}
              <div className="md:col-span-3">
                <ProfileContent
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientProfile;
