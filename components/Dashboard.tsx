

import React from 'react';
import { UserRole, PollutionReport, MaintenanceRequest, Notification } from '../types';
import HouseholdDashboard from './dashboards/HouseholdDashboard';
import CommunityDashboard from './dashboards/CommunityDashboard';
import WetlandMonitoring from './dashboards/WetlandMonitoring';
import AdminDashboard from './dashboards/AdminDashboard';
import ResearcherDashboard from './dashboards/ResearcherDashboard';

interface DashboardProps {
  activeRole: UserRole;
  reports: PollutionReport[];
  onAddReport: (report: Omit<PollutionReport, 'id' | 'timestamp' | 'reporterId' | 'updates'>) => void;
  onUpdateReport: (report: PollutionReport) => void;
  maintenanceRequests: MaintenanceRequest[];
  householdNotifications: Notification[];
  onAddNotification: (notif: Omit<Notification, 'id'>) => void;
  onAddMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'householdId' | 'reportedAt' | 'status'>) => void;
  onScheduleMaintenance: (requestId: string, scheduledDateTime: string) => void;
  onUpdateNotification: (notificationId: number, updates: Partial<Notification>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    activeRole, 
    reports, 
    onAddReport, 
    onUpdateReport,
    maintenanceRequests,
    householdNotifications,
    onAddNotification,
    onAddMaintenanceRequest,
    onScheduleMaintenance,
    onUpdateNotification
}) => {
  switch (activeRole) {
    case UserRole.HOUSEHOLD:
      return <HouseholdDashboard 
        notifications={householdNotifications}
        onAddNotification={onAddNotification}
        onAddMaintenanceRequest={onAddMaintenanceRequest}
        onUpdateNotification={onUpdateNotification}
      />;
    case UserRole.COMMUNITY:
      return <CommunityDashboard 
        reports={reports} 
        onAddReport={onAddReport}
        onUpdateReport={onUpdateReport}
      />;
    case UserRole.WETLAND:
        return <WetlandMonitoring />;
    case UserRole.ADMIN:
        return <AdminDashboard 
            reports={reports}
            onUpdateReport={onUpdateReport}
            maintenanceRequests={maintenanceRequests}
            onScheduleMaintenance={onScheduleMaintenance}
        />;
    case UserRole.RESEARCHER:
        return <ResearcherDashboard />;
    default:
      return <div className="text-center p-8">Select a role from the sidebar.</div>;
  }
};

export default Dashboard;