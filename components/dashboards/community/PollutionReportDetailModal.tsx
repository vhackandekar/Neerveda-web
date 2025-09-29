import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../common/Modal';
import { PollutionReport, ReportStatus } from '../../../types';
import { statusClassMap } from './PollutionReportFeed';

interface PollutionReportDetailModalProps {
  report: PollutionReport;
  onClose: () => void;
  onUpdate: (updatedReport: PollutionReport) => void;
}

const PollutionReportDetailModal: React.FC<PollutionReportDetailModalProps> = ({ report, onClose, onUpdate }) => {
    const { t } = useTranslation();
    const [newStatus, setNewStatus] = useState<ReportStatus>(report.status);
    const [notes, setNotes] = useState('');
    const [evidence, setEvidence] = useState<File | null>(null);

    const handleUpdate = () => {
        const updatedReport = { ...report };
        updatedReport.status = newStatus;
        updatedReport.updates.push({
            status: newStatus,
            timestamp: 'Just now',
            author: 'Official Name', // Mocked official
            notes: notes || undefined,
            evidenceUrl: evidence ? URL.createObjectURL(evidence) : undefined,
        });
        onUpdate(updatedReport);
        setNotes('');
        setEvidence(null);
    };

    const severityLevels: { [key: number]: { text: string; color: string } } = {
        1: { text: t('severity_1'), color: 'text-gray-600' },
        2: { text: t('severity_2'), color: 'text-yellow-600' },
        3: { text: t('severity_3'), color: 'text-orange-600' },
        4: { text: t('severity_4'), color: 'text-red-600' },
        5: { text: t('severity_5'), color: 'text-red-800' },
    };
    
    const currentSeverity = severityLevels[report.severity] || severityLevels[3];
    const classes = statusClassMap[report.status];

    return (
        <Modal title={`${t('pollution_report_id')}: ${report.id}`} onClose={onClose}>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-800">{report.location.address}</h3>
                        <p className="text-sm text-gray-500">{report.timestamp}</p>
                    </div>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${classes.bg} ${classes.text}`}>
                        {report.status}
                    </span>
                </div>

                {/* Image */}
                <div className="relative">
                    <img src={report.imageUrl} alt="Pollution" className="rounded-lg w-full" />
                    {report.boundingBox && (
                        <div
                            className="absolute border-2 border-red-500 pointer-events-none"
                            style={{
                                left: `${(report.boundingBox.x / 800) * 100}%`, // Assuming image width is 800px for calc
                                top: `${(report.boundingBox.y / 600) * 100}%`,   // Assuming image height is 600px for calc
                                width: `${(report.boundingBox.width / 800) * 100}%`,
                                height: `${(report.boundingBox.height / 600) * 100}%`,
                            }}
                        />
                    )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">{t('comment')}</h4>
                        <p className="text-gray-800">{report.comment}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">{t('severity')}</h4>
                        <p className={`font-bold ${currentSeverity.color}`}>{currentSeverity.text}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">{t('tagged_officials')}</h4>
                        <ul className="list-disc list-inside">
                            {report.taggedOfficials.map(off => <li key={off.id} className="text-sm text-gray-700">{off.name}, <span className="text-gray-500">{off.title}</span></li>)}
                        </ul>
                    </div>
                    {report.sensorSnapshot && (
                        <div>
                            <h4 className="font-semibold text-gray-600 text-sm">{t('sensor_snapshot')}</h4>
                            <p className="text-sm text-gray-700">TDS: {report.sensorSnapshot.tds}ppm, Turbidity: {report.sensorSnapshot.turbidity} NTU</p>
                        </div>
                    )}
                </div>
                
                {/* Timeline / Updates */}
                <div>
                    <h4 className="font-semibold text-gray-600 text-sm mb-2">{t('update_history')}</h4>
                    <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                        {report.updates.map((update, index) => (
                             <div key={index}>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm text-gray-800">{update.status}</p>
                                    <p className="text-xs text-gray-400">{update.timestamp}</p>
                                </div>
                                <p className="text-xs text-gray-500">by {update.author}</p>
                                {update.notes && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-1">{update.notes}</p>}
                                {update.evidenceUrl && <img src={update.evidenceUrl} alt="Evidence" className="mt-2 rounded-md w-48"/>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Official's Action Panel */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">{t('update_status_action')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">{t('new_status')}</label>
                            <select id="status-select" value={newStatus} onChange={e => setNewStatus(e.target.value as ReportStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-eco-blue focus:border-eco-blue sm:text-sm rounded-md">
                                {Object.values(ReportStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="evidence-file" className="block text-sm font-medium text-gray-700">{t('upload_evidence')}</label>
                             <input id="evidence-file" type="file" onChange={e => setEvidence(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-eco-blue-light file:text-white hover:file:bg-eco-blue"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="shadow-sm focus:ring-eco-blue focus:border-eco-blue mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="mt-4 text-right">
                        <button onClick={handleUpdate} className="bg-eco-blue hover:bg-eco-blue-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            {t('submit_update')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PollutionReportDetailModal;
