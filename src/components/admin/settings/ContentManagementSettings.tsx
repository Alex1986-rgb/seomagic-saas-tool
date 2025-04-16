
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutTemplate, 
  Type, 
  Link, 
  User, 
  Mail, 
  Tag, 
  Bell,
  Home,
  FileText,
  MapPin,
  HelpCircle,
  Settings
} from 'lucide-react';
import { 
  HomePageSettings,
  AuditPageSettings,
  ButtonsSettings,
  NavigationSettings,
  AboutPageSettings,
  ContactPageSettings,
  PricingSettings,
  NotificationSettings
} from './content';
import { useContentSettings } from '@/hooks/useContentSettings';
import SaveContentButton from './content/SaveContentButton';

const ContentManagementSettings: React.FC = () => {
  const contentSettings = useContentSettings();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="homePage">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="homePage" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Главная страница</span>
          </TabsTrigger>
          <TabsTrigger value="auditPage" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Страница аудита</span>
          </TabsTrigger>
          <TabsTrigger value="aboutPage" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>О нас</span>
          </TabsTrigger>
          <TabsTrigger value="contactPage" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Контакты</span>
          </TabsTrigger>
          <TabsTrigger value="pricingPage" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Цены</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Глобальные кнопки</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Навигация</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="homePage">
          <HomePageSettings 
            homePageContent={contentSettings.homePageContent}
            updateHeroField={contentSettings.updateHeroField}
            updateFeature={contentSettings.updateFeature}
            updateCtaField={contentSettings.updateCtaField}
          />
        </TabsContent>
        
        <TabsContent value="auditPage">
          <AuditPageSettings 
            auditPageContent={contentSettings.auditPageContent}
            updateAuditField={contentSettings.updateAuditField}
            updateAuditTip={contentSettings.updateAuditTip}
          />
        </TabsContent>
        
        <TabsContent value="aboutPage">
          <AboutPageSettings 
            aboutPageContent={contentSettings.aboutPageContent}
            updateAboutField={contentSettings.updateAboutField}
            updateSection={contentSettings.updateSection}
            updateTeamMember={contentSettings.updateTeamMember}
            addSection={contentSettings.addSection}
            removeSection={contentSettings.removeSection}
            addTeamMember={contentSettings.addTeamMember}
            removeTeamMember={contentSettings.removeTeamMember}
          />
        </TabsContent>
        
        <TabsContent value="contactPage">
          <ContactPageSettings 
            contactPageContent={contentSettings.contactPageContent}
            updateContactField={contentSettings.updateContactField}
            updateFormField={contentSettings.updateFormField}
            addFormField={contentSettings.addFormField}
            removeFormField={contentSettings.removeFormField}
          />
        </TabsContent>
        
        <TabsContent value="pricingPage">
          <PricingSettings 
            pricingContent={contentSettings.pricingContent}
            updatePlan={contentSettings.updatePlan}
            updatePlanFeature={contentSettings.updatePlanFeature}
            addPlanFeature={contentSettings.addPlanFeature}
            removePlanFeature={contentSettings.removePlanFeature}
            addPlan={contentSettings.addPlan}
            removePlan={contentSettings.removePlan}
            updateComparison={contentSettings.updateComparison}
            addComparisonFeature={contentSettings.addComparisonFeature}
            removeComparisonFeature={contentSettings.removeComparisonFeature}
          />
        </TabsContent>
        
        <TabsContent value="buttons">
          <ButtonsSettings />
        </TabsContent>
        
        <TabsContent value="navigation">
          <NavigationSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings 
            notificationSettings={contentSettings.notificationSettings}
            updateEmailSettings={contentSettings.updateEmailSettings}
            updateEmailTemplate={contentSettings.updateEmailTemplate}
            addEmailTemplate={contentSettings.addEmailTemplate}
            removeEmailTemplate={contentSettings.removeEmailTemplate}
            updateSiteSettings={contentSettings.updateSiteSettings}
            updateSiteNotification={contentSettings.updateSiteNotification}
            addSiteNotification={contentSettings.addSiteNotification}
            removeSiteNotification={contentSettings.removeSiteNotification}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <SaveContentButton />
      </div>
    </div>
  );
};

export default ContentManagementSettings;
