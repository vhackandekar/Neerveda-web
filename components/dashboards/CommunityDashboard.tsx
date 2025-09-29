
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import BarChart from '../common/BarChart';
import { mockCommunityData, mockMaintenanceTasks, mockPollutionHotspots, mockHistoricalData } from '../../services/mockData';
import { ClipboardDocumentListIcon, ExclamationTriangleIcon, UsersIcon, DropletIcon } from '../common/Icons';
import PollutionReportFeed from './community/PollutionReportFeed';
import ReportPollutionModal from './community/ReportPollutionModal';
import { PollutionReport } from '../../types';
import PollutionReportDetailModal from './community/PollutionReportDetailModal';

interface CommunityDashboardProps {
    reports: PollutionReport[];
    onAddReport: (report: Omit<PollutionReport, 'id' | 'timestamp' | 'reporterId' | 'updates'>) => void;
    onUpdateReport: (report: PollutionReport) => void;
}

const CommunityDashboard: React.FC<CommunityDashboardProps> = ({ reports, onAddReport, onUpdateReport }) => {
    const { t } = useTranslation();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(null);

    const handleOpenReportModal = () => setIsReportModalOpen(true);
    const handleCloseReportModal = () => setIsReportModalOpen(false);

    const handleViewReportDetail = (report: PollutionReport) => {
        setSelectedReport(report);
    };
    
    const handleCloseDetailModal = () => {
        setSelectedReport(null);
    };

    const handleUpdateReport = (updatedReport: PollutionReport) => {
        onUpdateReport(updatedReport);
        setSelectedReport(updatedReport);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <h2 className="text-2xl font-semibold text-gray-700">{t('community_overview')}</h2>
                </div>
                {/* Stat Cards */}
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
                            <p className="text-2xl font-semibold text-gray-800">{mockMaintenanceTasks.filter(t => t.status === 'Pending').length}</p>
                        </div>
                    </div>
                </Card>

                {/* Pollution Reporting Feature */}
                <div className="md:col-span-2 lg:col-span-4">
                    <PollutionReportFeed 
                        reports={reports} 
                        onReportPollutionClick={handleOpenReportModal}
                        onViewReport={handleViewReportDetail}
                    />
                </div>


                {/* Maintenance Schedule */}
                <Card title={t('maintenance_schedule')} className="md:col-span-2 lg:col-span-3">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('task')}</th>
                                    <th scope="col" className="px-6 py-3">{t('assigned_to')}</th>
                                    <th scope="col" className="px-6 py-3">{t('status')}</th>
                                    <th scope="col" className="px-6 py-3">{t('due_date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockMaintenanceTasks.map(task => (
                                    <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{task.description}</td>
                                        <td className="px-6 py-4">{task.assignedTo}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>{task.status}</span>
                                        </td>
                                        <td className="px-6 py-4">{task.dueDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pollution Hotspots */}
                <Card title={t('pollution_hotspots')} className="md:col-span-2 lg:col-span-1">
                    <div className="space-y-4">
                        {mockPollutionHotspots.map(hotspot => (
                            <div key={hotspot.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="font-semibold text-red-800">{hotspot.location}</p>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className={`font-bold ${hotspot.severity === 'High' ? 'text-status-red' : 'text-status-yellow'}`}>{hotspot.severity}</span>
                                    <span className="text-gray-500">{hotspot.lastReported}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Community Water Quality */}
                <Card title={t('community_water_quality')} className="md:col-span-2 lg:col-span-4">
                    <div className="h-80">
                        <BarChart data={mockHistoricalData} dataKey="quality" xAxisDataKey="date" unit="" />
                    </div>
                </Card>
            </div>
            {isReportModalOpen && <ReportPollutionModal onClose={handleCloseReportModal} onSubmit={onAddReport} />}
            {selectedReport && <PollutionReportDetailModal report={selectedReport} onClose={handleCloseDetailModal} onUpdate={handleUpdateReport} />}
        </>
    );
};

export default CommunityDashboard;
