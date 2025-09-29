import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../types';
import { InformationCircleIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon } from './Icons';

interface NotificationItemProps {
  notification: Notification;
  onReportIssue?: () => void;
  onMarkAsRead?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onReportIssue, onMarkAsRead }) => {
  const { t } = useTranslation();
  const notificationStyles = {
    info: {
      icon: <InformationCircleIcon className="h-5 w-5 text-eco-blue" />,
      containerClasses: 'bg-blue-50 border-l-4 border-eco-blue',
    },
    alert: {
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-status-red" />,
      containerClasses: 'bg-red-50 border-l-4 border-status-red',
    },
    maintenance: {
      icon: <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />,
      containerClasses: 'bg-yellow-50 border-l-4 border-status-yellow',
    },
    action_required: {
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-status-red" />,
      containerClasses: 'bg-red-50 border-l-4 border-status-red',
    },
  };

  const styles = notificationStyles[notification.type];

  // A fallback style for any unknown notification types
  if (!styles) {
    return (
      <div className="flex items-start p-4 rounded-r-md bg-gray-100 border-l-4 border-gray-400">
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-800">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-r-md ${styles.containerClasses} ${notification.read ? 'opacity-60' : ''}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-800">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
        </div>
      </div>
      {(onReportIssue || onMarkAsRead) && (
        <div className="mt-3 ml-8 flex gap-4">
          {onReportIssue && (
            <button
              onClick={onReportIssue}
              className="px-3 py-1 bg-white text-status-red border border-status-red text-xs font-semibold rounded-md hover:bg-red-50 transition-colors"
            >
              {t('report_issue', 'Report Issue')}
            </button>
          )}
          {onMarkAsRead && (
            <button
              onClick={onMarkAsRead}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              {t('mark_as_read', 'Mark as Read')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;