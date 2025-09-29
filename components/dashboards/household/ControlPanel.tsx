import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../common/Modal';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import ToggleSwitch from '../../common/ToggleSwitch';
import { WrenchIcon, ArrowPathIcon, BeakerIcon, ArrowsUpDownIcon, RectangleStackIcon, FilterIcon } from '../../common/Icons';

// Sub-component for a pipe with animated flow
const Pipe: React.FC<{ active: boolean }> = ({ active }) => {
    const flowAnimation = active ? 'animate-water-flow' : '';
    const bgGradient = active
        ? 'bg-[linear-gradient(90deg,transparent_50%,#64B5F6_50%)] bg-[length:200%_100%]'
        : 'bg-gray-300';
    return <div className={`h-1.5 w-full rounded ${bgGradient} ${flowAnimation}`}></div>;
};

// Sub-component for a system node (e.g., pump, filter)
const SystemNode: React.FC<{ icon: React.ReactNode; name: string; active: boolean; children?: React.ReactNode; }> = ({ icon, name, active, children }) => {
    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border-2 ${active ? 'border-eco-blue bg-blue-50' : 'border-gray-300 bg-gray-100'}`}>
                {icon}
                <span className={`absolute -top-1 -right-1 block h-3 w-3 rounded-full ring-2 ring-white ${active ? 'bg-status-green' : 'bg-gray-400'}`}></span>
            </div>
            <p className={`text-xs font-semibold ${active ? 'text-gray-700' : 'text-gray-500'}`}>{name}</p>
            {children}
        </div>
    );
};


type ControlPanelProps = {
    onAddNotification: (notif: Omit<import('../../../types').Notification, 'id'>) => void;
};

const InteractiveSystemDiagram: React.FC<ControlPanelProps> = ({ onAddNotification }) => {
    const { t } = useTranslation();
    const [isAutoMode, setIsAutoMode] = useState(true);
    const [isPumpOn, setIsPumpOn] = useState(true);
    const [isChlorinationOn, setIsChlorinationOn] = useState(false);
    const [isAerationOn, setIsAerationOn] = useState(true);
    const [isFilterActive] = useState(true); // Filter is always on if pump is on
    // Minimal anomaly alert state
    const [showAnomaly, setShowAnomaly] = useState(false);
    const [pendingAlert, setPendingAlert] = useState<{ timestamp: string; sensor: string; value: number; message: string } | null>(null);
    const [anomalyLog, setAnomalyLog] = useState<Array<{ timestamp: string; sensor: string; value: number; message: string }>>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    // Cooldowns
    const lastAlertRef = useRef<Record<string, number>>({});
    const globalCooldownRef = useRef<number>(0);
    const SENSOR_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes per sensor
    const GLOBAL_COOLDOWN_MS = 30 * 1000; // 30 seconds after any alert

    const systemActive = isPumpOn && !isAutoMode; // Simplified logic for flow animation
    
    // Simple simulated detection every 10s
    useEffect(() => {
        const getRandomSensorData = () => ({
            DO: +(Math.random() * 6 + 2).toFixed(2),
            turbidity: +(Math.random() * 30).toFixed(1),
            TDS: +(Math.random() * 800 + 100).toFixed(0),
            ORP: +(Math.random() * 900 + 100).toFixed(0),
        });
        const thresholds = {
            DO: { dir: 'lt' as const, value: 3.5, message: 'Dissolved Oxygen too low!' },
            turbidity: { dir: 'gt' as const, value: 20, message: 'Turbidity too high!' },
            TDS: { dir: 'gt' as const, value: 500, message: 'TDS exceeds safe limit!' },
            ORP: { dir: 'gt' as const, value: 700, message: 'ORP spike detected!' }
        };
        const check = () => {
            if (showAnomaly) return; // don't stack alerts; wait until closed
            // Respect global cooldown
            if (Date.now() < globalCooldownRef.current) return;
            const s = getRandomSensorData();
            let found: { sensor: keyof typeof thresholds; value: number; message: string } | null = null;
            (Object.keys(thresholds) as Array<keyof typeof thresholds>).some((key) => {
                const t = thresholds[key];
                const val = s[key];
                const hit = t.dir === 'gt' ? val > t.value : val < t.value;
                if (hit) {
                    // Per-sensor cooldown
                    const last = lastAlertRef.current[key as string] || 0;
                    if (Date.now() - last < SENSOR_COOLDOWN_MS) {
                        return false; // skip this sensor; continue checking others
                    }
                    found = { sensor: key, value: val, message: t.message };
                    return true;
                }
                return false;
            });
            if (found) {
                const ts = new Date().toLocaleString();
                setPendingAlert({ timestamp: ts, sensor: found.sensor, value: found.value, message: found.message });
                setShowAnomaly(true);
                if (audioRef.current) audioRef.current.play();
            }
        };
        // run immediately and then every 10s
        const intervalId = setInterval(check, 10000);
        check();
        return () => clearInterval(intervalId);
    }, [showAnomaly]);

    return (
        <Card>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <WrenchIcon className="w-6 h-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-700">{t('system_flow_title')}</h3>
                </div>
                <div className="ml-auto" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
                <div>
                    <p className="font-semibold text-gray-800">{t('auto_mode_label')}</p>
                    <p className="text-xs text-gray-500">{t('auto_mode_desc')}</p>
                </div>
                <ToggleSwitch checked={isAutoMode} onChange={setIsAutoMode} />
            </div>

            <div className="flex items-center justify-between w-full gap-2" aria-label="System Diagram">
                <SystemNode icon={<RectangleStackIcon className="w-6 h-6 text-warm-brown"/>} name={t('system_collection')} active={true} />
                <Pipe active={isPumpOn && !isAutoMode} />
                <SystemNode icon={<ArrowPathIcon className="w-6 h-6 text-eco-blue"/>} name={t('system_pump')} active={isPumpOn}>
                    <ToggleSwitch checked={isPumpOn} onChange={setIsPumpOn} disabled={isAutoMode} />
                </SystemNode>
                <Pipe active={isPumpOn && !isAutoMode} />
                <SystemNode icon={<FilterIcon className="w-6 h-6 text-gray-600"/>} name={t('system_filter')} active={isFilterActive && isPumpOn} />
                <Pipe active={isPumpOn && !isAutoMode} />
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <SystemNode icon={<BeakerIcon className="w-5 h-5 text-earth-brown"/>} name={t('system_chlorine')} active={isChlorinationOn}>
                            <ToggleSwitch checked={isChlorinationOn} onChange={setIsChlorinationOn} disabled={isAutoMode} />
                        </SystemNode>
                        <SystemNode icon={<ArrowsUpDownIcon className="w-5 h-5 text-eco-green"/>} name={t('system_aeration')} active={isAerationOn}>
                            <ToggleSwitch checked={isAerationOn} onChange={setIsAerationOn} disabled={isAutoMode} />
                        </SystemNode>
                    </div>
                </div>
                <Pipe active={isPumpOn && !isAutoMode} />
                <SystemNode icon={<RectangleStackIcon className="w-6 h-6 text-vibrant-blue"/>} name={t('system_storage')} active={true} />
            </div>

            {/* Minimal anomaly alert */}
            <Modal
                open={showAnomaly}
                title="Alert"
                closeOnBackdrop={false}
                onClose={() => {
                    if (pendingAlert) {
                        // log locally and push to notifications
                        setAnomalyLog((prev) => [pendingAlert!, ...prev]);
                        // Set cooldowns on close
                        lastAlertRef.current[pendingAlert.sensor] = Date.now();
                        globalCooldownRef.current = Date.now() + GLOBAL_COOLDOWN_MS;
                        onAddNotification({
                            type: 'alert',
                            message: `${pendingAlert.message} (Sensor: ${pendingAlert.sensor}, Value: ${pendingAlert.value})`,
                            timestamp: new Date().toLocaleString(),
                            read: false,
                            sensor: pendingAlert.sensor,
                            value: pendingAlert.value,
                            severity: 'high',
                        });
                    }
                    setShowAnomaly(false);
                    setPendingAlert(null);
                }}
            >
                <div>
                    <p className="font-semibold text-red-600 mb-2">🔔 Alert</p>
                    <p className="whitespace-pre-line text-sm">{pendingAlert ? `Sensor: ${pendingAlert.sensor}\nValue: ${pendingAlert.value}\nMessage: ${pendingAlert.message}` : ''}</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={() => {
                                if (pendingAlert) {
                                    setAnomalyLog((prev) => [pendingAlert!, ...prev]);
                                    // Set cooldowns on close
                                    lastAlertRef.current[pendingAlert.sensor] = Date.now();
                                    globalCooldownRef.current = Date.now() + GLOBAL_COOLDOWN_MS;
                                    onAddNotification({
                                        type: 'alert',
                                        message: `${pendingAlert.message} (Sensor: ${pendingAlert.sensor}, Value: ${pendingAlert.value})`,
                                        timestamp: new Date().toLocaleString(),
                                        read: false,
                                        sensor: pendingAlert.sensor,
                                        value: pendingAlert.value,
                                        severity: 'high',
                                    });
                                }
                                setShowAnomaly(false);
                                setPendingAlert(null);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
                <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto" />
            </Modal>

            {/* Anomaly log */}
            {anomalyLog.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Anomaly Event Log</h4>
                    <ul className="text-xs max-h-32 overflow-y-auto bg-gray-50 rounded p-2">
                        {anomalyLog.map((log, idx) => (
                            <li key={`${log.timestamp}-${idx}`} className="mb-1">
                                <span className="font-bold">[{log.timestamp}]</span> Sensor: <span className="text-red-600">{log.sensor}</span> Value: {log.value} — {log.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default InteractiveSystemDiagram;
