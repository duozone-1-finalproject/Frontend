// components/auth/SocialLogin.tsx
import React from 'react';

type OAuthProvider = 'naver' | 'kakao' | 'google';

interface SocialLoginButtonProps {
  provider: OAuthProvider;
  onClick: (provider: OAuthProvider) => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClick }) => {
  const providerConfig = {
    naver:  { src: '/img/naver.png',  alt: 'Naver' },
    kakao:  { src: '/img/kakao.png',  alt: 'Kakao' },
    google: { src: '/img/google.png', alt: 'Google' },
  } as const;

  const config = providerConfig[provider];

  return (
    <button
      onClick={() => onClick(provider)}
      className="w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm overflow-hidden hover:opacity-80"
    >
      <img
        src={config.src}
        alt={config.alt}
        className="w-full h-full object-contain"
      />
    </button>
  );
};

interface SocialLoginProps {
  onOAuthLogin: (provider: OAuthProvider) => void;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ onOAuthLogin }) => {
  return (
    <>
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4 text-sm text-gray-500">소셜 계정으로 간편 로그인</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center gap-4">
        <SocialLoginButton provider="naver" onClick={onOAuthLogin} />
        <SocialLoginButton provider="kakao" onClick={onOAuthLogin} />
        <SocialLoginButton provider="google" onClick={onOAuthLogin} />
      </div>
    </>
  );
};