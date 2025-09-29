

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import BarChart from '../../common/BarChart';
import { mockConservationData } from '../../../services/mockData';
import { ChartBarIcon } from '../../common/Icons';

type CompareByType = 'locationType' | 'populationDensity' | 'lpcd';

const FreshwaterConservationChart: React.FC = () => {
    const { t } = useTranslation();
    const [compareBy, setCompareBy] = useState<CompareByType>('locationType');

    const processedData = useMemo(() => {
        const dataMap = new Map<string, number>();

        mockConservationData.forEach(item => {
            const category = item[compareBy];
            const currentSum = dataMap.get(category) || 0;
            dataMap.set(category, currentSum + item.freshwaterSaved);
        });

        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [compareBy]);

    const filterOptions: { key: CompareByType; tKey: string }[] = [
        { key: 'locationType', tKey: 'filter_location' },
        { key: 'populationDensity', tKey: 'filter_population' },
        { key: 'lpcd', tKey: 'filter_usage' },
    ];

    return (
        <Card title={t('conservation_analysis')} className="md:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                 <div className="flex items-center text-gray-500 mb-3 md:mb-0">
                    <ChartBarIcon className="w-5 h-5 mr-2"/>
                    <p className="text-sm">{t('compare_criteria_desc')}</p>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                    {filterOptions.map(option => (
                         <button
                            key={option.key}
                            onClick={() => setCompareBy(option.key)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                                compareBy === option.key
                                    ? 'bg-white text-eco-green shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {t(option.tKey)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-80">
                <BarChart data={processedData} xAxisDataKey="name" dataKey="value" unit=" L" barColor="#4CAF50" />
            </div>
        </Card>
    );
};

export default FreshwaterConservationChart;