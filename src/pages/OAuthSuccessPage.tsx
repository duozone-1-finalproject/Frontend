// pages/OAuthSuccessPage.tsx (리팩토링된 버전)
import React from 'react';
import { useOAuthSuccess } from '../hooks/auth/useOAuthSuccess';
import { Card } from '../components/common';
import { ProcessingStatus } from '../components/auth/oauth/ProcessingStatus';

const OAuthSuccessPage: React.FC = () => {
  const { processingState, message, handleManualRedirect } = useOAuthSuccess();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <ProcessingStatus 
          state={processingState} 
          message={message}
          onManualRedirect={handleManualRedirect}
        />
      </Card>
    </div>
  );
};

export default OAuthSuccessPage; 