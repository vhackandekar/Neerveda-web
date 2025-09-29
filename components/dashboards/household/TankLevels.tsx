import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import TankLevelDisplay from './TankLevelDisplay';
import { RectangleStackIcon } from '../../common/Icons';

interface Tank {
  current: number;
  capacity: number;
}

interface TankLevelsProps {
  collection: Tank;
  storage: Tank;
}

const TankLevels: React.FC<TankLevelsProps> = ({ collection, storage }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex items-center mb-4">
        <RectangleStackIcon className="w-6 h-6 text-gray-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-700">{t('tank_levels_title')}</h3>
      </div>
      <div className="flex justify-around items-end gap-6 h-64">
        <TankLevelDisplay
          label={t('tank_collection')}
          current={collection.current}
          capacity={collection.capacity}
          colorFrom="from-warm-brown"
          colorTo="to-warm-brown-light"
        />
        <TankLevelDisplay
          label={t('tank_storage')}
          current={storage.current}
          capacity={storage.capacity}
          colorFrom="from-vibrant-blue"
          colorTo="to-vibrant-blue-light"
        />
      </div>
    </Card>
  );
};

export default TankLevels;
