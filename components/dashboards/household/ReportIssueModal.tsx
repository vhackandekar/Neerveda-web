import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../common/Modal';
import { MaintenanceRequest, Notification } from '../../../types';
import { DocumentArrowUpIcon } from '../../common/Icons';

interface ReportIssueModalProps {
    notification: Notification;
    onClose: () => void;
    onSubmit: (request: Omit<MaintenanceRequest, 'id' | 'householdId' | 'reportedAt' | 'status'>) => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ notification, onClose, onSubmit }) => {
    const { t } = useTranslation();
    // Prefill helpers
    const defaultUrgency = useMemo<'Low' | 'Medium' | 'High'>(() => {
        switch (notification.severity) {
            case 'low': return 'Low';
            case 'medium': return 'Medium';
            case 'high':
            case 'critical':
                return 'High';
            default: return 'Medium';
        }
    }, [notification.severity]);
    // Smarter mapping with overrides per sensor
    const sensorMap = {
        turbidity: { issueType: 'Filter Clog / High Turbidity', urgency: 'Medium' as const, suggestions: ['Filter housing', 'Intake mesh', 'Near outdoor pump'] },
        tds: { issueType: 'Bad Odor / Water Color', urgency: 'Medium' as const, suggestions: ['Storage tank', 'Distribution line', 'Kitchen sink'] },
        orp: { issueType: 'Disinfection / ORP Spike', urgency: 'High' as const, suggestions: ['Chlorination unit', 'Dosing line', 'Contact chamber'] },
        do: { issueType: 'Low Dissolved Oxygen', urgency: 'High' as const, suggestions: ['Aeration module', 'Return line', 'Settling tank'] },
    } as const;
    const detectedKey = useMemo(() => {
        const s = (notification.sensor || '').toLowerCase();
        if (s.includes('turbidity')) return 'turbidity' as const;
        if (s.includes('tds')) return 'tds' as const;
        if (s.includes('orp')) return 'orp' as const;
        if (s.includes('do')) return 'do' as const;
        return null;
    }, [notification.sensor]);
    const defaultIssueType = detectedKey ? sensorMap[detectedKey].issueType : '';
    const defaultDetails = useMemo(() => notification.message || '', [notification.message]);

    const [issueType, setIssueType] = useState(defaultIssueType);
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>(detectedKey ? sensorMap[detectedKey].urgency : defaultUrgency);
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [details, setDetails] = useState(defaultDetails);
    const [media, setMedia] = useState<File | null>(null);
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            issueType,
            urgency,
            location,
            address,
            details,
            mediaUrl: media ? URL.createObjectURL(media) : undefined,
            originNotificationId: notification.id,
            anomalyContext: {
                sensor: notification.sensor,
                value: notification.value,
            },
            latitude,
            longitude,
        });
    };

    const issueTypes = ["Leak Detected", "Strange Noise", "Low Pressure", "System Offline / No Power", "Bad Odor / Water Color", "Other"];

    return (
        <Modal title={t('report_system_issue_title', 'Report a System Issue')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded-r-md">
                    {t('reporting_for_alert', 'Reporting for alert')}: "{notification.message}"
                </p>
                
                <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">{t('issue_type', 'Issue Type')}</label>
                    <select id="issueType" value={issueType} onChange={e => setIssueType(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-eco-blue focus:border-eco-blue sm:text-sm rounded-md">
                        <option value="" disabled>{t('select_issue_type', 'Select an issue type...')}</option>
                        {issueTypes.map(type => <option key={type} value={type}>{t(`issue_${type.toLowerCase().replace(/ \/ /g, '_').replace(/ /g, '_')}`, type)}</option>)}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('urgency', 'Urgency')}</label>
                    <div className="mt-1 flex space-x-4">
                        {(['Low', 'Medium', 'High'] as const).map(level => (
                             <label key={level} className="flex items-center">
                                <input type="radio" name="urgency" value={level} checked={urgency === level} onChange={() => setUrgency(level)} className="focus:ring-eco-blue h-4 w-4 text-eco-blue border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700">{t(`urgency_${level.toLowerCase()}`, level)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('issue_location', 'Location of the Issue')}</label>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-eco-blue focus:border-eco-blue sm:text-sm rounded-md"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">{t('choose_favorite', 'Choose favorite...')}</option>
                            {detectedKey && sensorMap[detectedKey].suggestions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                            {/* Common fallbacks */}
                            {!detectedKey && ['Near outdoor pump', 'Filter housing', 'Chlorination unit', 'Aeration module', 'Storage tank'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder={t('issue_location_placeholder', 'e.g., Near the outdoor pump')}
                            required
                            className="sm:col-span-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('address', 'Address')}</label>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder={t('address_placeholder', 'e.g., 123 Main St, City, State')} className="sm:col-span-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                        <button
                            type="button"
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition((pos) => {
                                        setLatitude(pos.coords.latitude);
                                        setLongitude(pos.coords.longitude);
                                    });
                                }
                            }}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md"
                        >
                            {t('use_my_location', 'Use my location')}
                        </button>
                    </div>
                    {(latitude !== undefined && longitude !== undefined) && (
                        <p className="mt-1 text-xs text-gray-500">{t('coords', 'Coords')}: {latitude.toFixed(5)}, {longitude.toFixed(5)}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">{t('issue_details', 'Describe the Issue')}</label>
                    <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} rows={4} placeholder={t('issue_details_placeholder', 'Please provide as much detail as possible.')} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>

                <div>
                     <label htmlFor="media-upload" className="block text-sm font-medium text-gray-700">{t('upload_media', 'Upload Photo/Video (Optional)')}</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                           <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400"/>
                           <div className="flex text-sm text-gray-600">
                               <label htmlFor="media-file" className="relative cursor-pointer bg-white rounded-md font-medium text-eco-blue hover:text-eco-blue-light focus-within:outline-none">
                                   <span>{t('upload_a_file', 'Upload a file')}</span>
                                   <input id="media-file" name="media-file" type="file" className="sr-only" onChange={e => setMedia(e.target.files ? e.target.files[0] : null)} />
                               </label>
                               <p className="pl-1">{t('or_drag_drop', 'or drag and drop')}</p>
                           </div>
                           <p className="text-xs text-gray-500">{media ? media.name : t('media_file_types', 'PNG, JPG, MP4 up to 10MB')}</p>
                        </div>
                     </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        {t('cancel', 'Cancel')}
                    </button>
                    <button type="submit" className="bg-eco-blue hover:bg-eco-blue-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {t('submit_report', 'Submit Report')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
export default ReportIssueModal;