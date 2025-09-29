import React from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  open?: boolean;
  closeOnBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, open = true, closeOnBackdrop = true }) => {
  if (!open) return null;
  const handleBackdropClick = closeOnBackdrop ? onClose : undefined;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div>
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
