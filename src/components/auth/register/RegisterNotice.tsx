// components/auth/RegisterNotice.tsx
import React from 'react';

export const RegisterNotice: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-xs text-blue-600 text-center">
        회원가입 후 관리자 승인이 필요할 수 있습니다.
      </p>
    </div>
  );
};