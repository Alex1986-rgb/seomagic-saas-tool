
import React from "react";
import { Server } from "lucide-react";
import MonitoringHeader from "./MonitoringHeader";
import { 
  cpuUsageData, 
  memoryUsageData, 
  diskUsageData, 
  trafficData, 
  errorDistributionData, 
  statCards, 
  systemStatus, 
  recentEvents, 
  sectionLinks, 
  systemWarnings, 
  serverInfoData 
} from "./monitoringData";
import SystemWarnings from "./SystemWarnings";
import StatCards from "./StatCards";
import SystemGraphs from "./SystemGraphs";
import SystemStatusGrid from "./SystemStatusGrid";
import EventLog from "./EventLog";
import ErrorDistributionChart from "./ErrorDistributionChart";
import SectionLinks from "./SectionLinks";
import ServerInfo from "./ServerInfo";

const AdminMonitoringContainer: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-7xl text-white">
    <MonitoringHeader />
    <div className="mb-8">
      <SystemWarnings warnings={systemWarnings} />
    </div>
    <StatCards
      statCards={statCards}
      cpuUsageData={cpuUsageData}
      memoryUsageData={memoryUsageData}
      diskUsageData={diskUsageData}
    />
    <SystemGraphs
      cpuUsageData={cpuUsageData}
      memoryUsageData={memoryUsageData}
      trafficData={trafficData}
    />
    
    <div className="bg-gradient-to-br from-[#232539]/90 to-[#1E1B34]/95 border border-primary/15 rounded-2xl p-6 mb-8 shadow-lg">
      <h2 className="text-xl font-bold mb-5 text-white flex items-center gap-2">
        <Server className="h-5 w-5 text-primary" />
        Статус системных компонентов
      </h2>
      <SystemStatusGrid systemStatus={systemStatus} />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <EventLog recentEvents={recentEvents} />
      <ErrorDistributionChart errorDistributionData={errorDistributionData} />
    </div>
    <SectionLinks sectionLinks={sectionLinks} />
    <ServerInfo info={serverInfoData} />
  </div>
);

export default AdminMonitoringContainer;
