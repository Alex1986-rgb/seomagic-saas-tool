import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditTypeSelector } from '@/components/site-audit/AuditTypeSelector';
import { Card } from '@/components/ui/card';
import { Zap, Activity, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useScanContext } from '@/contexts/ScanContext';

interface AuditWorkspaceProps {
  url: string;
  onStartAudit: (type: 'quick' | 'deep') => void;
  isStartingAudit: boolean;
  children: React.ReactNode; // AuditResultsContainer
}

type TabValue = 'start' | 'progress' | 'results';

export const AuditWorkspace: React.FC<AuditWorkspaceProps> = ({
  url,
  onStartAudit,
  isStartingAudit,
  children
}) => {
  const { taskId, isScanning, scanDetails } = useScanContext();
  const [activeTab, setActiveTab] = useState<TabValue>('start');

  // Load saved tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(`audit_tab_${url}`);
    if (savedTab && ['start', 'progress', 'results'].includes(savedTab)) {
      setActiveTab(savedTab as TabValue);
    }
  }, [url]);

  // Auto-switch tabs based on audit state
  useEffect(() => {
    console.log('[AUDIT WORKSPACE] Tab switching logic:', {
      isScanning,
      taskId,
      status: scanDetails?.status,
      hasAuditData: !!scanDetails?.audit_data,
      activeTab,
      shouldSwitchToResults: !isScanning && taskId && (scanDetails?.status === 'completed' || scanDetails?.audit_data)
    });

    if (isScanning && activeTab !== 'progress') {
      setActiveTab('progress');
      localStorage.setItem(`audit_tab_${url}`, 'progress');
    } else if (
      !isScanning && 
      taskId && 
      (scanDetails?.status === 'completed' || scanDetails?.audit_data) && 
      activeTab !== 'results'
    ) {
      console.log('[AUDIT WORKSPACE] ✅ Switching to results tab');
      setActiveTab('results');
      localStorage.setItem(`audit_tab_${url}`, 'results');
      
      // Show toast notification
      if (scanDetails?.audit_data) {
        setTimeout(() => {
          const toast = document.createElement('div');
          toast.textContent = '✅ Результаты аудита готовы!';
          toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3000);
        }, 100);
      }
    }
  }, [isScanning, taskId, scanDetails?.status, scanDetails?.audit_data, url, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    localStorage.setItem(`audit_tab_${url}`, value);
  };

  // Determine tab status icons
  const getTabIcon = (tab: TabValue) => {
    if (tab === 'start') {
      return <Zap className="h-4 w-4" />;
    }
    if (tab === 'progress') {
      if (isScanning) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
      }
      return <Activity className="h-4 w-4" />;
    }
    if (tab === 'results') {
      if (scanDetails?.audit_data || scanDetails?.status === 'completed') {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      }
      return <FileText className="h-4 w-4" />;
    }
  };

  const getTabLabel = (tab: TabValue) => {
    if (tab === 'start') return 'Запуск аудита';
    if (tab === 'progress') {
      if (isScanning && scanDetails?.pages_scanned !== undefined) {
        return `Прогресс (${scanDetails.pages_scanned}/${scanDetails.estimated_pages || '?'})`;
      }
      return 'Прогресс';
    }
    if (tab === 'results') return 'Результаты';
  };

  const isTabDisabled = (tab: TabValue) => {
    // Start is always available
    if (tab === 'start') return false;
    // Progress available when scanning or has taskId
    if (tab === 'progress') return !taskId;
    // Results available when has data OR completed (even during scanning for partial results)
    if (tab === 'results') {
      return !taskId || (!scanDetails?.audit_data && scanDetails?.status !== 'completed');
    }
    return false;
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger 
            value="start" 
            disabled={isTabDisabled('start')}
            className="flex items-center gap-2"
          >
            {getTabIcon('start')}
            <span className="hidden sm:inline">{getTabLabel('start')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="progress" 
            disabled={isTabDisabled('progress')}
            className="flex items-center gap-2"
          >
            {getTabIcon('progress')}
            <span className="hidden sm:inline">{getTabLabel('progress')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            disabled={isTabDisabled('results')}
            className="flex items-center gap-2"
          >
            {getTabIcon('results')}
            <span className="hidden sm:inline">{getTabLabel('results')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="start" className="mt-0">
          <div className="p-6">
            <AuditTypeSelector 
              onStartAudit={onStartAudit}
              isLoading={isStartingAudit}
              url={url}
            />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <div className="p-6">
            {children}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          <div className="p-6">
            {children}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
