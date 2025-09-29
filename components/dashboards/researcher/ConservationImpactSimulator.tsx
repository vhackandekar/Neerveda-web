
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { CalculatorIcon } from '../../common/Icons';

const RECYCLABLE_PERCENTAGE = 0.60; // 60% of water is recoverable greywater
const SYSTEM_EFFICIENCY = 0.85; // System recycles 85% of recoverable water

const ConservationImpactSimulator: React.FC = () => {
    const { t } = useTranslation();
    const [population, setPopulation] = useState(1000);
    const [lpcd, setLpcd] = useState(135); // Liters per capita per day

    const totalDemand = population * lpcd * 30;
    const greywaterRecycled = totalDemand * RECYCLABLE_PERCENTAGE * SYSTEM_EFFICIENCY;
    const netFreshwater = totalDemand - greywaterRecycled;
    const savingsPercentage = totalDemand > 0 ? (greywaterRecycled / totalDemand) * 100 : 0;

    const calculations = {
        totalDemand,
        greywaterRecycled,
        netFreshwater,
        savingsPercentage,
    };


    const formatNumber = (num: number) => Math.round(num).toLocaleString();

    return (
        <Card title={t('conservation_simulator')} className="md:col-span-2">
            <div className="flex items-center text-gray-500 mb-6 -mt-2">
                <CalculatorIcon className="w-5 h-5 mr-2" />
                <p className="text-sm">{t('simulator_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Population Slider */}
                <div>
                    <label htmlFor="population-slider" className="block text-sm font-medium text-gray-700">
                        {t('population')}: <span className="font-bold text-eco-blue">{population.toLocaleString()}</span>
                    </label>
                    <input
                        id="population-slider"
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={population}
                        onChange={(e) => setPopulation(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-eco-blue"
                        aria-label="Population slider"
                    />
                </div>
                {/* LPCD Slider */}
                <div>
                    <label htmlFor="lpcd-slider" className="block text-sm font-medium text-gray-700">
                        {t('water_usage_lpcd')}: <span className="font-bold text-eco-green">{lpcd} L</span>
                    </label>
                    <input
                        id="lpcd-slider"
                        type="range"
                        min="50"
                        max="250"
                        step="5"
                        value={lpcd}
                        onChange={(e) => setLpcd(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-eco-green"
                        aria-label="Water usage per capita per day slider"
                    />
                </div>
            </div>

            {/* Results */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-3">{t('monthly_results')}</h4>
                <div className="space-y-4 mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-8 flex overflow-hidden" role="progressbar" aria-valuenow={calculations.savingsPercentage} aria-valuemin={0} aria-valuemax={100}>
                        <div
                            className="bg-eco-green h-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300"
                            style={{ width: `${calculations.savingsPercentage}%` }}
                            title={`${t('greywater_recycled')}: ${formatNumber(calculations.greywaterRecycled)} L`}
                        >
                           {calculations.savingsPercentage > 15 && `${calculations.savingsPercentage.toFixed(0)}%`}
                        </div>
                         <div
                            className="bg-eco-blue-light h-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300"
                            style={{ width: `${100 - calculations.savingsPercentage}%` }}
                            title={`${t('net_freshwater_needed')}: ${formatNumber(calculations.netFreshwater)} L`}
                        >
                           {(100 - calculations.savingsPercentage) > 15 && `${(100 - calculations.savingsPercentage).toFixed(0)}%`}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">{t('total_demand')}</p>
                            <p className="text-xl font-bold text-gray-800">{formatNumber(calculations.totalDemand)} L</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('greywater_recycled')}</p>
                            <p className="text-xl font-bold text-eco-green">{formatNumber(calculations.greywaterRecycled)} L</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('net_freshwater_needed')}</p>
                            <p className="text-xl font-bold text-eco-blue">{formatNumber(calculations.netFreshwater)} L</p>
                        </div>
                    </div>
                </div>
                 <div className="mt-4 p-3 bg-blue-50 border-l-4 border-eco-blue-light rounded-r-lg">
                    <p className="text-sm text-eco-blue">
                        {t('simulator_assumption')}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default ConservationImpactSimulator;