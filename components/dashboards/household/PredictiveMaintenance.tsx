import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { ShieldCheckIcon, SparklesIcon } from '../../common/Icons';
import { getPredictiveMaintenanceAlert } from '../../../services/geminiService';
import { PredictiveAlert, SystemHealthStatus } from '../../../types';

const AlertSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="flex justify-center">
            <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-5 w-3/4 mx-auto bg-gray-200 rounded-md"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
    </div>
);

const PredictiveMaintenance: React.FC = () => {
    const { t } = useTranslation();
    const [alert, setAlert] = useState<PredictiveAlert | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunDiagnostics = async () => {
        setIsLoading(true);
        setError(null);
        setAlert(null);
        try {
            // Mocking system health data for the AI analysis
            const mockSystemHealth = {
                filterPressure: 18, // high
                pumpUptimeHours: 750, // needs check soon
                waterTurbidityTrend: 'increasing' as const
            };
            const result = await getPredictiveMaintenanceAlert(mockSystemHealth);
            setAlert(result);
        } catch (err) {
            setError("Failed to retrieve predictive analysis. Please try again later.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const statusMap: Record<SystemHealthStatus, { text: string; bg: string; ring: string }> = {
        [SystemHealthStatus.OPTIMAL]: { text: 'text-green-800', bg: 'bg-green-100', ring: 'ring-status-green' },
        [SystemHealthStatus.DEGRADED]: { text: 'text-yellow-800', bg: 'bg-yellow-100', ring: 'ring-status-yellow' },
        [SystemHealthStatus.CRITICAL]: { text: 'text-red-800', bg: 'bg-red-100', ring: 'ring-status-red' },
    };

    return (
        <Card>
            <div className="flex items-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">{t('predictive_health_title')}</h3>
            </div>

            <div className="min-h-[320px] flex flex-col">
                {!isLoading && !alert && !error && (
                    <div className="flex-grow text-center p-4 flex flex-col items-center justify-center">
                        <p className="text-gray-600 mb-4 text-sm">
                            {t('predictive_health_desc')}
                        </p>
                        <button
                            onClick={handleRunDiagnostics}
                            className="w-full sm:w-auto px-6 py-2 bg-eco-blue text-white font-semibold rounded-lg hover:bg-eco-blue-light transition-colors flex items-center justify-center shadow-sm"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {t('run_diagnostics_button')}
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex-grow flex items-center justify-center">
                        <AlertSkeleton />
                    </div>
                )}

                {error && !isLoading && (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {alert && !isLoading && (
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="text-center">
                            <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full ring-4 ${statusMap[alert.status].ring}`}>
                                <span className="text-3xl font-bold text-gray-700">{alert.component}</span>
                            </div>

                            <div className="mt-4">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusMap[alert.status].bg} ${statusMap[alert.status].text}`}>
                                    {alert.status}
                                </span>
                            </div>

                            <div className="mt-4 text-left space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm">{t('prediction')}</h4>
                                    <p className="text-gray-800">{alert.prediction}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm">{t('recommendation')}</h4>
                                    <p className="text-gray-800">{alert.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PredictiveMaintenance;
