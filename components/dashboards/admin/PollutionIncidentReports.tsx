
import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { PollutionReport, ReportStatus } from '../../../types';
import { TicketIcon } from '../../common/Icons';

// Re-using the status map from the community feed
export const statusClassMap: Record<ReportStatus, { text: string; bg: string }> = {
    [ReportStatus.SUBMITTED]: { text: 'text-blue-800', bg: 'bg-blue-100' },
    [ReportStatus.ACKNOWLEDGED]: { text: 'text-gray-800', bg: 'bg-gray-200' },
    [ReportStatus.IN_PROGRESS]: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
    [ReportStatus.RESOLVED]: { text: 'text-green-800', bg: 'bg-green-100' },
    [ReportStatus.DUPLICATE]: { text: 'text-purple-800', bg: 'bg-purple-100' },
};

const severityTextMap: Record<number, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Critical',
};

interface PollutionIncidentReportsProps {
    reports: PollutionReport[];
    onViewReport: (report: PollutionReport) => void;
}

const PollutionIncidentReports: React.FC<PollutionIncidentReportsProps> = ({ reports, onViewReport }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <div className="flex items-center mb-4">
                <TicketIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">{t('pollution_reports_title')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('report_id_short')}</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">{t('severity')}</th>
                            <th scope="col" className="px-6 py-3">{t('status')}</th>
                            <th scope="col" className="px-6 py-3">Reported</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? reports.map(report => {
                            const statusClasses = statusClassMap[report.status];
                            return (
                                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-600">{report.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{report.location.address}</td>
                                    <td className="px-6 py-4 font-semibold">{severityTextMap[report.severity] || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses.bg} ${statusClasses.text}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{report.timestamp}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onViewReport(report)} className="font-medium text-eco-blue hover:underline">
                                            {t('view_details')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    {t('no_pollution_reports')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PollutionIncidentReports;
