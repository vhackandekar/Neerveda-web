import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { BeakerIcon } from '../../common/Icons';

const mockSpecies = [
    { name: 'Cattail (Typha latifolia)', sightings: 120, status: 'Abundant' },
    { name: 'Bluegill (Lepomis macrochirus)', sightings: 85, status: 'Common' },
    { name: 'Green Frog (Lithobates clamitans)', sightings: 45, status: 'Common' },
    { name: 'Great Blue Heron (Ardea herodias)', sightings: 12, status: 'Occasional' },
    { name: 'Dragonfly (Anisoptera)', sightings: 250, status: 'Abundant' },
];

const BiodiversityTracker: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Card title={t('biodiversity_tracker', 'Biodiversity Tracker')}>
            <div className="flex items-center text-gray-500 mb-4 -mt-2">
                <BeakerIcon className="w-5 h-5 mr-2" />
                <p className="text-sm">{t('key_species_desc', 'Key indicator species observed in the wetland ecosystem.')}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('species', 'Species')}</th>
                            <th scope="col" className="px-6 py-3">{t('sightings_last_30d', 'Sightings (30d)')}</th>
                            <th scope="col" className="px-6 py-3">{t('status', 'Status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockSpecies.map(species => (
                            <tr key={species.name} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{species.name}</td>
                                <td className="px-6 py-4">{species.sightings}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        species.status === 'Abundant' ? 'bg-green-100 text-green-800' :
                                        species.status === 'Common' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>{species.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default BiodiversityTracker;
