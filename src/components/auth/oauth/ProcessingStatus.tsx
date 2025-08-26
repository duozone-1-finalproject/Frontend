// components/oauth/ProcessingStatus.tsx
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Loading } from '../../common';

type ProcessingState = 'loading' | 'success' | 'error';

interface ProcessingStatusProps {
  state: ProcessingState;
  message: string;
  onManualRedirect?: () => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  state, 
  message, 
  onManualRedirect 
}) => {
  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loading size="lg" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (state) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="text-center">
      {getIcon()}
      <h2 className={`text-2xl font-bold ${getMessageColor()} mb-2`}>
        {message}
      </h2>
      {state === 'loading' && (
        <p className="text-sm text-gray-500">잠시 후 자동으로 이동합니다.</p>
      )}
      {state === 'success' && (
        <p className="text-sm text-green-600">1.5초 후 메인 페이지로 이동합니다.</p>
      )}
      
      {state === 'error' && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-600 text-center">
            소셜 로그인 처리 중 문제가 발생했습니다.
          </p>
          {onManualRedirect && (
            <button
              onClick={onManualRedirect}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인 페이지로 이동
            </button>
          )}
        </div>
      )}
      
      {state === 'loading' && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
