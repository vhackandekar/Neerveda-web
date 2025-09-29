
import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import LineChart from '../common/LineChart';
import BarChart from '../common/BarChart';
import { mockHistoricalData, mockWeeklyUsageData, mockCommunityData, mockMaintenanceTasks, mockPollutionHotspots } from '../../services/mockData';
import { ArrowDownCircleIcon } from '../common/Icons';
import ConservationImpactSimulator from './researcher/ConservationImpactSimulator';
import FreshwaterConservationChart from './researcher/FreshwaterConservationChart';

const ResearcherDashboard: React.FC = () => {
    const { t } = useTranslation();

    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const handleExportHouseholdCSV = () => {
        const headers = ['date', 'usage_liters', 'quality_index'];
        const csvRows = [
            headers.join(','),
            ...mockWeeklyUsageData.map(row => `${row.date},${row.usage},${row.quality}`)
        ];
        const csvContent = csvRows.join('\n');
        downloadFile(csvContent, 'household_weekly_usage.csv', 'text/csv;charset=utf-8;');
    };

    const handleExportCommunityJSON = () => {
        const communityData = {
            overview: mockCommunityData,
            maintenanceTasks: mockMaintenanceTasks,
            pollutionHotspots: mockPollutionHotspots,
            historicalWaterQuality: mockHistoricalData,
        };
        const jsonContent = JSON.stringify(communityData, null, 2);
        downloadFile(jsonContent, 'community_data.json', 'application/json');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-700">{t('researcher_dashboard_title')}</h2>
            </div>
            
            <Card title={t('data_export')}>
                <div className="p-4">
                    <p className="text-gray-600 mb-4">{t('export_desc')}</p>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={handleExportHouseholdCSV}
                            className="flex items-center px-4 py-2 bg-eco-green text-white font-semibold rounded-lg hover:bg-eco-green-light transition-colors">
                            <ArrowDownCircleIcon className="w-5 h-5 mr-2"/>
                            {t('export_household_csv')}
                        </button>
                        <button 
                            onClick={handleExportCommunityJSON}
                            className="flex items-center px-4 py-2 bg-eco-blue text-white font-semibold rounded-lg hover:bg-eco-blue-light transition-colors">
                            <ArrowDownCircleIcon className="w-5 h-5 mr-2"/>
                            {t('export_community_json')}
                        </button>
                    </div>
                </div>
            </Card>

             <Card title={t('api_access')}>
                 <div className="p-4">
                    <p className="text-gray-600 mb-4">{t('api_desc')}</p>
                    <button className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                        {t('api_docs_button')}
                    </button>
                 </div>
            </Card>
            
            <FreshwaterConservationChart />
            <ConservationImpactSimulator />

            <Card title={t('usage_history_title')} className="md:col-span-2">
                <div className="h-80 p-4">
                    <LineChart data={mockHistoricalData} dataKey="usage" xAxisDataKey="date" unit="L" />
                </div>
            </Card>

            <Card title={t('community_water_quality')} className="md:col-span-2">
                 <div className="h-80 p-4">
                    <BarChart data={mockHistoricalData} dataKey="quality" xAxisDataKey="date" unit="" />
                 </div>
            </Card>
        </div>
    );
};

export default ResearcherDashboard;
