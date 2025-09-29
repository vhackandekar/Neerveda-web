
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import MetricCard from '../common/MetricCard';
import LineChart from '../common/LineChart';
import NotificationItem from '../common/NotificationItem';
import ControlPanel from './household/ControlPanel';
import WaterSavingsTracker from './household/WaterSavingsTracker';
import TankLevels from './household/TankLevels';
import PredictiveMaintenance from './household/PredictiveMaintenance';
import { getWaterReuseInsight } from '../../services/geminiService';
import { mockHouseholdMetrics, mockWeeklyUsageData } from '../../services/mockData';
import { StatusIndicator, WaterQualityMetrics, AIRecommendation, RecommendationStatus, Notification, MaintenanceRequest } from '../../types';
import { SparklesIcon, CheckIcon, XCircleIcon, ChevronDownIcon, ArrowPathIcon } from '../common/Icons';
import ReportIssueModal from './household/ReportIssueModal';

const AIInsightSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-7 w-28 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-5 w-3/4 bg-gray-200 rounded-md mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-3"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md"></div>
                </div>
            </div>
            <div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-3"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md"></div>
                </div>
            </div>
        </div>
    </div>
);

interface HouseholdDashboardProps {
    notifications: Notification[];
    onAddNotification: (notif: Omit<Notification, 'id'>) => void;
    onAddMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'householdId' | 'reportedAt' | 'status'>) => void;
    onUpdateNotification: (notificationId: number, updates: Partial<Notification>) => void;
}

const HouseholdDashboard: React.FC<HouseholdDashboardProps> = ({ notifications = [], onAddNotification, onAddMaintenanceRequest, onUpdateNotification }) => {
    const { t } = useTranslation();
    const [waterQuality] = useState<WaterQualityMetrics>(mockHouseholdMetrics.waterQuality);
    const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { tankLevels } = mockHouseholdMetrics;
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

    const handleGetRecommendation = async () => {
        setIsLoading(true);
        try {
            const recommendation = await getWaterReuseInsight(waterQuality);
            setAiRecommendation(recommendation);
        } catch (error) {
            console.error("Failed to get AI recommendation", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReportIssue = (notification: Notification) => {
        setActiveNotification(notification);
        setIsIssueModalOpen(true);
    };

    const handleMarkAsRead = (notificationId: number) => {
        onUpdateNotification(notificationId, { read: true });
    };

    const handleSubmitIssue = (requestData: Omit<MaintenanceRequest, 'id' | 'householdId' | 'reportedAt' | 'status'>) => {
        onAddMaintenanceRequest(requestData);
        // Auto-mark read when a report is submitted
        if (activeNotification) {
            onUpdateNotification(activeNotification.id, { read: true });
        }
        setIsIssueModalOpen(false);
        setActiveNotification(null);
    };

    const statusColorMap: Record<RecommendationStatus, { text: string; bg: string; }> = {
        [RecommendationStatus.EXCELLENT]: { text: 'text-green-800', bg: 'bg-green-100' },
        [RecommendationStatus.GOOD]: { text: 'text-eco-green', bg: 'bg-green-50' },
        [RecommendationStatus.CAUTION]: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
        [RecommendationStatus.UNSAFE]: { text: 'text-red-800', bg: 'bg-red-100' },
    };

    return (
        <>
            <div className="flex flex-col gap-8">
                {/* Section 1: At-a-Glance Metrics */}
                <section aria-labelledby="metrics-title">
                    <h2 id="metrics-title" className="sr-only">{t('metrics_title')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <MetricCard title={t('metric_ph')} value={waterQuality.ph.toFixed(1)} status={waterQuality.ph > 6.5 && waterQuality.ph < 8.5 ? StatusIndicator.GREEN : StatusIndicator.YELLOW} />
                        <MetricCard title={t('metric_tds')} value={waterQuality.tds.toString()} unit="ppm" status={waterQuality.tds < 500 ? StatusIndicator.GREEN : StatusIndicator.YELLOW} />
                        <MetricCard title={t('metric_turbidity')} value={waterQuality.turbidity.toString()} unit="NTU" status={waterQuality.turbidity < 5 ? StatusIndicator.GREEN : StatusIndicator.RED} />
                        <MetricCard title={t('metric_temp')} value={`${waterQuality.temperature}°C`} status={waterQuality.temperature > 10 && waterQuality.temperature < 35 ? StatusIndicator.GREEN : StatusIndicator.YELLOW} />
                    </div>
                </section>

                {/* Section 2: Main Content Area */}
                <section aria-labelledby="main-dashboard-title" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <h2 id="main-dashboard-title" className="sr-only">Main Dashboard Content</h2>
                    
                    {/* Left Column: Performance & Analysis */}
                    <div className="flex flex-col gap-6">
                        <WaterSavingsTracker savings={mockHouseholdMetrics.waterSaved} />
                        <Card title={t('usage_history_title')}>
                            <div className="h-80">
                                <LineChart data={mockWeeklyUsageData} dataKey="usage" xAxisDataKey="date" unit=" L" />
                            </div>
                        </Card>
                        <PredictiveMaintenance />
                    </div>

                    {/* Right Column: System Status & AI */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <SparklesIcon className="w-6 h-6 text-eco-green mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-700">{t('ai_insight_title')}</h3>
                                </div>
                                {aiRecommendation && !isLoading && (
                                    <button
                                        onClick={handleGetRecommendation}
                                        className="text-sm font-medium text-eco-green hover:text-eco-green-light flex items-center transition-colors"
                                        aria-label="Refresh AI recommendation"
                                    >
                                        <ArrowPathIcon className="w-4 h-4 mr-1" />
                                        {t('refresh_button')}
                                    </button>
                                )}
                            </div>
                            <div className="min-h-[290px] flex flex-col">
                                {isLoading ? (
                                    <div className="flex-grow flex items-center justify-center">
                                        <AIInsightSkeleton />
                                    </div>
                                ) : aiRecommendation ? (
                                    <div className="flex-grow flex flex-col justify-center">
                                        <div>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColorMap[aiRecommendation.status].bg} ${statusColorMap[aiRecommendation.status].text}`}>
                                                {aiRecommendation.status}
                                            </span>
                                            <p className="text-gray-800 font-medium my-4">{aiRecommendation.recommendation}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-600 mb-2">{t('suitable_for')}</h4>
                                                    <ul className="space-y-1.5">
                                                        {aiRecommendation.suitableUses.map((use) => (
                                                            <li key={use} className="flex items-center text-sm text-gray-700">
                                                                <CheckIcon className="w-5 h-5 text-status-green mr-2 flex-shrink-0"/>
                                                                {use}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-600 mb-2">{t('not_suitable_for')}</h4>
                                                    <ul className="space-y-1.5">
                                                        {aiRecommendation.unsuitableUses.map((use) => (
                                                            <li key={use} className="flex items-center text-sm text-gray-700">
                                                                <XCircleIcon className="w-5 h-5 text-status-red mr-2 flex-shrink-0"/>
                                                                {use}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            <details className="group">
                                                <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800 list-none">
                                                    {t('why')}
                                                    <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-open:rotate-180" />
                                                </summary>
                                                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-600">{aiRecommendation.explanation}</p>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-grow p-4 flex flex-col items-center justify-center text-center">
                                        <p className="text-gray-600 mb-4">
                                            {t('ai_insight_desc')}
                                        </p>
                                        <button
                                            onClick={handleGetRecommendation}
                                            className="w-full sm:w-auto px-6 py-2 bg-eco-green text-white font-semibold rounded-lg hover:bg-eco-green-light transition-colors flex items-center justify-center shadow-sm"
                                        >
                                            <SparklesIcon className="w-5 h-5 mr-2" />
                                            {t('get_recommendation_button')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>
                        <TankLevels collection={tankLevels.collection} storage={tankLevels.storage} />
                        <ControlPanel onAddNotification={onAddNotification} />
                    </div>
                </section>

                {/* Section 3: Notifications */}
                <section aria-labelledby="notifications-title">
                    <h2 id="notifications-title" className="sr-only">{t('notifications_title')}</h2>
                    <Card title={t('notifications_title')}>
                        <div className="space-y-3">
                            {notifications?.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onReportIssue={() => handleReportIssue(notification)}
                                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                />
                            ))}
                        </div>
                    </Card>
                </section>
            </div>
            {isIssueModalOpen && activeNotification && (
                <ReportIssueModal
                    notification={activeNotification}
                    onClose={() => setIsIssueModalOpen(false)}
                    onSubmit={handleSubmitIssue}
                />
            )}
        </>
    );
};

export default HouseholdDashboard;