
import React, { useState } from 'react';
import ProfileHeader from '@/components/client/ProfileHeader';
import ProfileSidebar from '@/components/client/ProfileSidebar';
import ProfileContent from '@/components/client/ProfileContent';

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('audits');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
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
  );
};

export default ClientProfile;
