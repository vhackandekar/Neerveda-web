import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { DropletIcon } from '../../common/Icons';

interface WaterSavingsTrackerProps {
  savings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
}

const COST_PER_LITRE = 0.35; // Example cost: ₹0.35 per litre

const WaterSavingsTracker: React.FC<WaterSavingsTrackerProps> = ({ savings }) => {
  const { t } = useTranslation();
  type Period = 'today' | 'week' | 'month';
  type DisplayMode = 'litres' | 'money';

  const [activePeriod, setActivePeriod] = useState<Period>('month');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('litres');

  const formatMoney = (value: number) => {
    return (value * COST_PER_LITRE).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const periodData = {
    today: { value: savings.today, goal: 200, label: t('this_day') },
    week: { value: savings.week, goal: 1400, label: t('this_week') },
    month: { value: savings.month, goal: 5000, label: t('this_month') },
  };

  const currentData = periodData[activePeriod];
  const progressPercentage = Math.min((currentData.value / currentData.goal) * 100, 100);

  const periodButtons: { key: Period; tKey: string }[] = [
    { key: 'today', tKey: 'savings_period_day' },
    { key: 'week', tKey: 'savings_period_week' },
    { key: 'month', tKey: 'savings_period_month' },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-center">
          <DropletIcon className="w-6 h-6 text-eco-green mr-3"/>
          <h3 className="text-lg font-semibold text-gray-700">{t('savings_title')}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            {periodButtons.map(button => (
              <button key={button.key} onClick={() => setActivePeriod(button.key)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${ activePeriod === button.key ? 'bg-white text-eco-green shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {t(button.tKey)}
              </button>
            ))}
          </div>
           <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setDisplayMode('litres')} className={`px-2 py-1 text-xs font-medium rounded-md ${displayMode === 'litres' ? 'bg-white text-eco-blue shadow-sm' : 'text-gray-600'}`}>{t('savings_display_litres')}</button>
            <button onClick={() => setDisplayMode('money')} className={`px-2 py-1 text-xs font-medium rounded-md ${displayMode === 'money' ? 'bg-white text-eco-blue shadow-sm' : 'text-gray-600'}`}>{t('savings_display_money')}</button>
          </div>
        </div>
      </div>
      
      <div className="text-center my-8">
        <p className="text-sm text-gray-500">{t('savings_label')}</p>
        <div className="my-2">
            <span className="text-6xl font-bold text-eco-green tracking-tight">
              {displayMode === 'litres' ? currentData.value.toLocaleString() : formatMoney(currentData.value)}
            </span>
            {displayMode === 'litres' && <span className="text-xl font-medium text-gray-500 ml-2">{t('savings_display_litres')}</span>}
        </div>
        <p className="text-sm text-gray-500">{currentData.label}</p>
      </div>

      <div>
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
            <span>{t('progress_goal')}</span>
            <span className="font-bold text-eco-green">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
                className="bg-eco-green h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
                role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}
                aria-label={`${currentData.label} savings progress`}
            ></div>
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">
            {t('goal')}: {displayMode === 'litres' ? `${currentData.goal.toLocaleString()} L` : formatMoney(currentData.goal)}
        </p>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-4 text-center">
        <p className="text-sm text-gray-500">{t('total_savings')}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
           {displayMode === 'litres' ? `${savings.total.toLocaleString()} L` : formatMoney(savings.total)}
        </p>
      </div>

    </Card>
  );
};

export default WaterSavingsTracker;