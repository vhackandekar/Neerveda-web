

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import { mockAdminData, mockCommunityData, mockMaintenanceTasks } from '../../services/mockData';
import { CpuChipIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon, UsersIcon, DropletIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon } from '../common/Icons';
import { PollutionReport, ReportStatus, MaintenanceRequest } from '../../types';
import PollutionIncidentReports from './admin/PollutionIncidentReports';
import PollutionReportDetailModal from './community/PollutionReportDetailModal';
import UserReportedIssues from './admin/UserReportedIssues';

interface AdminDashboardProps {
    reports: PollutionReport[];
    onUpdateReport: (report: PollutionReport) => void;
    maintenanceRequests: MaintenanceRequest[];
    onScheduleMaintenance: (requestId: string, scheduledDateTime: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onUpdateReport, maintenanceRequests, onScheduleMaintenance }) => {
    const { t } = useTranslation();
    const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(null);

    const handleViewReportDetail = (report: PollutionReport) => {
        setSelectedReport(report);
    };

    const handleCloseDetailModal = () => {
        setSelectedReport(null);
    };

    const handleUpdateReport = (updatedReport: PollutionReport) => {
        onUpdateReport(updatedReport);
        setSelectedReport(updatedReport); // Keep modal open with updated data
    };
    
    const pendingReportsCount = reports.filter(r => r.status !== ReportStatus.RESOLVED).length;
    const pendingTasksCount = mockMaintenanceTasks.filter(t => t.status === 'Pending').length;

    return (
        <>
            <div className="flex flex-col gap-8">
                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('community_overview')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-eco-blue-light bg-opacity-20">
                                    <UsersIcon className="h-6 w-6 text-eco-blue" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('total_households')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockCommunityData.totalHouseholds}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-eco-green-light bg-opacity-20">
                                <DropletIcon className="h-6 w-6 text-eco-green" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('water_saved_month')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockCommunityData.waterSaved.toLocaleString()} L</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-400 bg-opacity-20">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('active_alerts')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockCommunityData.activeAlerts}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-earth-brown-light bg-opacity-20">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-earth-brown" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('pending_tasks')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{pendingTasksCount}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('system_administration')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-gray-200"><CpuChipIcon className="h-6 w-6 text-gray-600" /></div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('total_sensors')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockAdminData.totalSensors}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100"><CheckCircleIcon className="h-6 w-6 text-status-green" /></div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('sensors_online')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockAdminData.onlineSensors}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100"><ClockIcon className="h-6 w-6 text-status-yellow" /></div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('calibration_due')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{mockAdminData.calibrationDue}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-red-100"><ExclamationCircleIcon className="h-6 w-6 text-status-red" /></div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{t('issues_reported')}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{pendingReportsCount}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                <section>
                    <UserReportedIssues
                        requests={maintenanceRequests}
                        onSchedule={onScheduleMaintenance}
                    />
                </section>

                <section>
                    <PollutionIncidentReports reports={reports} onViewReport={handleViewReportDetail} />
                </section>
            </div>
            {selectedReport && (
                <PollutionReportDetailModal 
                    report={selectedReport} 
                    onClose={handleCloseDetailModal} 
                    onUpdate={handleUpdateReport} 
                />
            )}
        </>
    );
};

export default AdminDashboard;