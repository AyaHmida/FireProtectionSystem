import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  dismissible = true,
}) => {
  const baseClasses = 'rounded-lg p-4 flex items-start';

  const typeClasses = {
    error: 'bg-red-50 text-red-800 border border-red-200',
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  };

  const iconClasses = {
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mr-3" />,
    success: <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mr-3" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mr-3" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mr-3" />,
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-start flex-1">
        {iconClasses[type]}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
