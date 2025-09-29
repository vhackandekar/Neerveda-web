
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { UserRole, PollutionReport, MaintenanceRequest, Notification, MaintenanceRequestStatus } from './types';
import { mockPollutionReports, mockMaintenanceRequests, mockHouseholdNotifications } from './services/mockData';
// Removed AnomalyAlert modal and related logic

function App() {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.HOUSEHOLD);
  const [pollutionReports, setPollutionReports] = useState<PollutionReport[]>(mockPollutionReports);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [householdNotifications, setHouseholdNotifications] = useState<Notification[]>(mockHouseholdNotifications);

  // One-time cleanup: remove old anomaly-related localStorage keys
  useEffect(() => {
    try {
      localStorage.removeItem('dismissedAnomalyIds');
      localStorage.removeItem('anomalySnoozeUntil');
      localStorage.removeItem('lastDismissedAnomalyKey');
    } catch {}
  }, []);


  const handleAddReport = (newReport: Omit<PollutionReport, 'id' | 'timestamp' | 'reporterId' | 'updates'>) => {
    const reportToAdd: PollutionReport = {
        ...newReport,
        id: `PR-${String(pollutionReports.length + 1).padStart(3, '0')}`,
        timestamp: 'Just now',
        reporterId: 'user-789', // Mocked current user
        updates: [],
    };
    setPollutionReports(prevReports => [reportToAdd, ...prevReports]);
  };

  const handleUpdateReport = (updatedReport: PollutionReport) => {
      setPollutionReports(prevReports => prevReports.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const handleAddMaintenanceRequest = (newRequest: Omit<MaintenanceRequest, 'id' | 'householdId' | 'reportedAt' | 'status'>) => {
      const requestToAdd: MaintenanceRequest = {
          ...newRequest,
          id: `MR-${String(maintenanceRequests.length + 1).padStart(3, '0')}`,
          householdId: 'user-789', // Mocked current user
          reportedAt: 'Just now',
          status: MaintenanceRequestStatus.PENDING,
      };
      setMaintenanceRequests(prev => [requestToAdd, ...prev]);

      // Find the original notification that triggered this and mark it as read/handled
      setHouseholdNotifications(prev => 
          prev.map(n => n.type === 'action_required' ? { ...n, read: true } : n)
      );
  };

  const handleScheduleMaintenance = (requestId: string, scheduledDateTime: string) => {
      setMaintenanceRequests(prev =>
          prev.map(req => 
              req.id === requestId 
              ? { ...req, status: MaintenanceRequestStatus.SCHEDULED, scheduledFor: scheduledDateTime } 
              : req
          )
      );

      // Add a confirmation notification for the household
      const newNotification: Notification = {
          id: householdNotifications.length + 1,
          type: 'info',
          message: `Your maintenance request #${requestId} has been scheduled for ${scheduledDateTime}.`,
          timestamp: 'Just now',
          read: false,
      };
      setHouseholdNotifications(prev => [newNotification, ...prev]);
  };
  
  const handleUpdateNotification = (notificationId: number, updates: Partial<Notification>) => {
      setHouseholdNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, ...updates } : n)
      );
  };

  const handleAddNotification = (notif: Omit<Notification, 'id'>) => {
      setHouseholdNotifications(prev => [
          { ...notif, id: prev.length ? Math.max(...prev.map(n => n.id)) + 1 : 1 },
          ...prev,
      ]);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeRole={activeRole} onRoleChange={setActiveRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeRole={activeRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Dashboard
            activeRole={activeRole}
            reports={pollutionReports}
            onAddReport={handleAddReport}
            onUpdateReport={handleUpdateReport}
            maintenanceRequests={maintenanceRequests}
            householdNotifications={householdNotifications}
            onAddNotification={handleAddNotification}
            onAddMaintenanceRequest={handleAddMaintenanceRequest}
            onScheduleMaintenance={handleScheduleMaintenance}
            onUpdateNotification={handleUpdateNotification}
          />
        </main>
      </div>
    </div>
  );
}

export default App;