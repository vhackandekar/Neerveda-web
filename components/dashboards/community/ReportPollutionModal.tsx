import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../common/Modal';
import { BoundingBox, Official, PollutionReport, ReportStatus } from '../../../types';
import { CameraIcon, DocumentArrowUpIcon, MapPinIcon, XMarkIcon } from '../../common/Icons';
import { mockOfficials } from '../../../services/mockData';
import ImageAnnotator from './ImageAnnotator';

interface ReportPollutionModalProps {
    onClose: () => void;
    onSubmit: (report: Omit<PollutionReport, 'id'| 'timestamp' | 'reporterId' | 'updates'>) => void;
}

const ReportPollutionModal: React.FC<ReportPollutionModalProps> = ({ onClose, onSubmit }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [image, setImage] = useState<string | null>(null);
    const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
    const [comment, setComment] = useState('');
    const [severity, setSeverity] = useState(3);
    const [taggedOfficials, setTaggedOfficials] = useState<Official[]>([]);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState('');


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTakePhotoClick = async () => {
        setIsCameraOpen(true);
        setLocationStatus(t('getting_location', 'Getting location...'));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setLocationStatus(`${t('location_acquired', 'Location acquired')}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            },
            (error) => {
                console.error(`Geolocation error (Code ${error.code}): ${error.message}`);
                setLocationStatus(t('location_error', 'Could not get location.'));
            }
        );

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Camera access error (${err.name}): ${err.message}`);
            } else {
                console.error("Camera access error:", err);
            }
            setIsCameraOpen(false);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImage(dataUrl);
            }
            handleCloseCamera();
        }
    };

    const handleCloseCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const handleOfficialToggle = (official: Official) => {
        setTaggedOfficials(prev => 
            prev.some(o => o.id === official.id) 
            ? prev.filter(o => o.id !== official.id)
            : [...prev, official]
        );
    };

    const handleSubmit = () => {
        if (!image) return; // Add validation
        onSubmit({
            imageUrl: image,
            boundingBox: boundingBox || undefined,
            comment,
            severity,
            location: location ? { // Use captured location
                latitude: location.latitude,
                longitude: location.longitude,
                address: `Coords: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
            } : { // Mocked location data as fallback
                latitude: 12.9730,
                longitude: 77.5960,
                address: 'Auto-detected: Near Sector D Creek'
            },
            taggedOfficials,
            sensorSnapshot: { // Mocked sensor data
                tds: 600,
                turbidity: 15,
            },
            status: ReportStatus.SUBMITTED,
        });
        onClose();
    };
    
    const severityLevels: { [key: number]: { text: string; color: string } } = {
        1: { text: t('severity_1'), color: 'bg-gray-400' },
        2: { text: t('severity_2'), color: 'bg-yellow-400' },
        3: { text: t('severity_3'), color: 'bg-orange-500' },
        4: { text: t('severity_4'), color: 'bg-red-500' },
        5: { text: t('severity_5'), color: 'bg-red-700' },
    };
    const currentSeverity = severityLevels[severity];

    if (isCameraOpen) {
        return (
            <Modal title={t('take_photo')} onClose={handleCloseCamera}>
                <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg bg-black"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button onClick={handleCapture} className="p-4 bg-white rounded-full shadow-lg ring-2 ring-white hover:bg-gray-200 transition-colors" aria-label={t('capture', 'Capture')}>
                            <CameraIcon className="w-8 h-8 text-eco-blue" />
                        </button>
                    </div>
                    <div className="absolute top-2 right-2">
                        <button onClick={handleCloseCamera} className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors" aria-label={t('cancel', 'Cancel')}>
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 text-white text-xs rounded-md">
                        {locationStatus}
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title={t('report_pollution_title')} onClose={onClose}>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                {/* Step 1: Image */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('step_1_image')}</h3>
                    {!image ? (
                        <div className="flex gap-4">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg text-gray-600 hover:border-eco-blue hover:text-eco-blue transition-colors">
                                <DocumentArrowUpIcon className="w-6 h-6" />
                                <span>{t('upload_photo')}</span>
                            </button>
                            <button onClick={handleTakePhotoClick} className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg text-gray-600 hover:border-eco-green hover:text-eco-green transition-colors">
                                <CameraIcon className="w-6 h-6" />
                                <span>{t('take_photo')}</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <ImageAnnotator imageUrl={image} onBoxChange={setBoundingBox} />
                             <p className="text-xs text-gray-500 mt-2">{t('image_annotator_instruction')}</p>
                        </div>
                    )}
                </div>

                {image && (
                    <>
                        {/* Step 2: Details */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">{t('step_2_details')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">{t('comment')}</label>
                                    <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} className="shadow-sm focus:ring-eco-blue focus:border-eco-blue mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder={t('comment_placeholder')}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700">{t('severity')}: <span className="font-bold">{currentSeverity.text}</span></label>
                                    <div className="flex items-center gap-2">
                                        <input id="severity" type="range" min="1" max="5" value={severity} onChange={e => setSeverity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                                        <div className={`w-4 h-4 rounded-full ${currentSeverity.color}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Location & Officials */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">{t('step_3_location')}</h3>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <MapPinIcon className="w-5 h-5 mr-2 text-eco-blue"/>
                                <p className="text-sm text-gray-700">
                                     {location 
                                        ? `Coords: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` 
                                        : 'Auto-detected: Near Sector D Creek'
                                    }
                                </p>
                            </div>

                             <h3 className="font-semibold text-gray-700 mb-2 mt-4">{t('tag_officials')}</h3>
                             <div className="space-y-2">
                                {mockOfficials.map(official => (
                                    <label key={official.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                        <input type="checkbox" checked={taggedOfficials.some(o => o.id === official.id)} onChange={() => handleOfficialToggle(official)} className="h-4 w-4 rounded border-gray-300 text-eco-blue focus:ring-eco-blue"/>
                                        <span className="ml-3 text-sm">
                                            <span className="font-medium text-gray-800">{official.name}</span>
                                            <span className="text-gray-500">, {official.title}</span>
                                        </span>
                                    </label>
                                ))}
                             </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t">
                            <button onClick={handleSubmit} className="w-full bg-eco-blue hover:bg-eco-blue-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                {t('submit_report')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ReportPollutionModal;