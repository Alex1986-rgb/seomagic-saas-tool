
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProfileHeader from '@/components/client/ProfileHeader';
import ProfileSidebar from '@/components/client/ProfileSidebar';
import ProfileContent from '@/components/client/ProfileContent';

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('audits');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <ProfileSidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            
            <ProfileContent 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientProfile;
