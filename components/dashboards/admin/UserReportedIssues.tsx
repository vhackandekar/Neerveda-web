import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { MaintenanceRequest, MaintenanceRequestStatus } from '../../../types';
import { WrenchScrewdriverIcon, CalendarDaysIcon } from '../../common/Icons';

interface UserReportedIssuesProps {
    requests: MaintenanceRequest[];
    onSchedule: (requestId: string, scheduledDateTime: string) => void;
}

const UserReportedIssues: React.FC<UserReportedIssuesProps> = ({ requests, onSchedule }) => {
    const { t } = useTranslation();
    const [schedulingId, setSchedulingId] = useState<string | null>(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const handleScheduleClick = (requestId: string) => {
        setSchedulingId(requestId);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0]);
        setScheduleTime('09:00');
    };

    const handleConfirmSchedule = () => {
        if (schedulingId && scheduleDate && scheduleTime) {
            const formattedDateTime = `${new Date(scheduleDate).toDateString()} @ ${scheduleTime}`;
            onSchedule(schedulingId, formattedDateTime);
            setSchedulingId(null);
            setScheduleDate('');
            setScheduleTime('');
        }
    };

    const statusColors: Record<MaintenanceRequestStatus, string> = {
        [MaintenanceRequestStatus.PENDING]: 'bg-red-100 text-red-800',
        [MaintenanceRequestStatus.SCHEDULED]: 'bg-yellow-100 text-yellow-800',
        [MaintenanceRequestStatus.RESOLVED]: 'bg-green-100 text-green-800',
        [MaintenanceRequestStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    };
    
    const urgencyColors: Record<string, string> = {
        'Low': 'text-gray-600',
        'Medium': 'text-yellow-600',
        'High': 'text-red-600 font-bold',
    };

    return (
        <Card>
            <div className="flex items-center mb-4">
                <WrenchScrewdriverIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">{t('user_reported_issues', 'User Reported Issues')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('request_id', 'Request ID')}</th>
                            <th scope="col" className="px-6 py-3">{t('issue_type', 'Issue')}</th>
                            <th scope="col" className="px-6 py-3">{t('urgency', 'Urgency')}</th>
                            <th scope="col" className="px-6 py-3">{t('status', 'Status')}</th>
                            <th scope="col" className="px-6 py-3">{t('scheduled_for', 'Scheduled For')}</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <React.Fragment key={req.id}>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-600">{req.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{req.issueType}</td>
                                    <td className={`px-6 py-4 ${urgencyColors[req.urgency]}`}>{req.urgency}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[req.status]}`}>{req.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{req.scheduledFor || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === MaintenanceRequestStatus.PENDING && (
                                            <button onClick={() => handleScheduleClick(req.id)} className="font-medium text-eco-blue hover:underline flex items-center">
                                                <CalendarDaysIcon className="w-4 h-4 mr-1"/>
                                                {t('schedule', 'Schedule')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {schedulingId === req.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="p-4">
                                            <div className="flex items-center gap-4">
                                                <h4 className="font-semibold text-sm">{t('set_schedule_for', 'Set schedule for')} {req.id}:</h4>
                                                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm" />
                                                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm" />
                                                <button onClick={handleConfirmSchedule} className="px-3 py-1 bg-eco-green text-white text-sm font-semibold rounded-md hover:bg-eco-green-light">{t('confirm', 'Confirm')}</button>
                                                <button onClick={() => setSchedulingId(null)} className="text-sm text-gray-600 hover:underline">{t('cancel', 'Cancel')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">{t('no_issues_reported', 'No new issues reported by users.')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
export default UserReportedIssues;