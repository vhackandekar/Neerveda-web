import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { PollutionReport, ReportStatus } from '../../../types';
import { ExclamationTriangleIcon, TicketIcon } from '../../common/Icons';

interface PollutionReportFeedProps {
  reports: PollutionReport[];
  onReportPollutionClick: () => void;
  onViewReport: (report: PollutionReport) => void;
}

export const statusClassMap: Record<ReportStatus, { text: string; bg: string }> = {
    [ReportStatus.SUBMITTED]: { text: 'text-blue-800', bg: 'bg-blue-100' },
    [ReportStatus.ACKNOWLEDGED]: { text: 'text-gray-800', bg: 'bg-gray-200' },
    [ReportStatus.IN_PROGRESS]: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
    [ReportStatus.RESOLVED]: { text: 'text-green-800', bg: 'bg-green-100' },
    [ReportStatus.DUPLICATE]: { text: 'text-purple-800', bg: 'bg-purple-100' },
};

const PollutionReportCard: React.FC<{ report: PollutionReport; onView: () => void }> = ({ report, onView }) => {
    const { t } = useTranslation();
    const classes = statusClassMap[report.status];
    
    return (
        <div className="p-4 border border-gray-200 rounded-lg flex gap-4 hover:bg-gray-50 transition-colors">
            <img src={report.imageUrl} alt="Pollution thumbnail" className="w-24 h-24 object-cover rounded-md flex-shrink-0"/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800">{report.location.address}</p>
                        <p className="text-xs text-gray-500">{t('report_id_short')}: {report.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes.bg} ${classes.text}`}>
                        {report.status}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.comment}</p>
                <div className="flex justify-between items-end mt-2">
                    <p className="text-xs text-gray-500">{report.timestamp}</p>
                    <button onClick={onView} className="text-sm font-semibold text-eco-blue hover:underline">
                        {t('view_details')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const PollutionReportFeed: React.FC<PollutionReportFeedProps> = ({ reports, onReportPollutionClick, onViewReport }) => {
  const { t } = useTranslation();

  return (
    <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
                <TicketIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">{t('pollution_reports_title')}</h3>
            </div>
            <button
                onClick={onReportPollutionClick}
                className="px-4 py-2 bg-status-red text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-sm"
            >
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                {t('report_pollution_button')}
            </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {reports.length > 0 ? (
                reports.map(report => (
                    <PollutionReportCard 
                        key={report.id} 
                        report={report}
                        onView={() => onViewReport(report)}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>{t('no_pollution_reports')}</p>
                </div>
            )}
        </div>
    </Card>
  );
};

export default PollutionReportFeed;
