import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import MetricCard from '../common/MetricCard';
import { mockWetlandData } from '../../services/mockData';
import { StatusIndicator } from '../../types';
import BiodiversityTracker from './wetland/BiodiversityTracker';
import { GlobeAltIcon, SunIcon, BeakerIcon as WaterIcon } from '../common/Icons';

const WetlandMonitoring: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-8">
            <section aria-labelledby="wetland-overview-title">
                <h2 id="wetland-overview-title" className="text-2xl font-semibold text-gray-700 mb-4">{t('wetland_monitoring_title', 'Wetland Monitoring')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <MetricCard title={t('health_status', 'Health Status')} value={t('status_healthy', 'Healthy')} status={mockWetlandData.healthStatus} />
                    <MetricCard title={t('biodiversity_index', 'Biodiversity Index')} value={mockWetlandData.biodiversityIndex.toString()} status={StatusIndicator.GREEN} />
                    <MetricCard title={t('water_inflow', 'Water Inflow')} value={`${mockWetlandData.inflow} m³/h`} status={StatusIndicator.GREEN} />
                    <MetricCard title={t('water_outflow', 'Water Outflow')} value={`${mockWetlandData.outflow} m³/h`} status={StatusIndicator.GREEN} />
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BiodiversityTracker />
                
                <div className="flex flex-col gap-6">
                    <Card title={t('environmental_factors', 'Environmental Factors')}>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <SunIcon className="w-6 h-6 text-yellow-500 mr-3"/>
                                <div>
                                    <p className="font-semibold text-gray-700">{t('seasonal_forecast', 'Seasonal Forecast')}</p>
                                    <p className="text-sm text-gray-500">{mockWetlandData.seasonalForecast}</p>
                                </div>
                            </div>
                             <div className="flex items-center">
                                <WaterIcon className="w-6 h-6 text-eco-blue mr-3"/>
                                <div>
                                    <p className="font-semibold text-gray-700">{t('water_balance', 'Water Balance')}</p>
                                    <p className="text-sm text-gray-500">{t('net_inflow', 'Net Inflow: {{value}} m³/h', { value: mockWetlandData.inflow - mockWetlandData.outflow })}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title={t('system_overview', 'System Overview')}>
                         <div className="flex items-center">
                            <GlobeAltIcon className="w-6 h-6 text-eco-green mr-3"/>
                            <div>
                                <p className="font-semibold text-gray-700">{t('constructed_wetland', 'Constructed Wetland')}</p>
                                <p className="text-sm text-gray-500">{t('wetland_desc', 'Eco-engineered system for natural water purification.')}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default WetlandMonitoring;