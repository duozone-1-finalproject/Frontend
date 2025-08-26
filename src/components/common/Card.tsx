// src/components/common/Card.tsx
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  padding = 'md',
  shadow = 'sm',
  border = true,
  className = '',
  onClick,
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const cardClasses = [
    'bg-white rounded-xl',
    shadowClasses[shadow],
    border ? 'border border-gray-200' : '',
    hover ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  const contentClasses = paddingClasses[padding];

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className={`flex justify-between items-start ${padding !== 'none' ? 'px-6 pt-6 pb-4' : ''}`}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="ml-4">{headerAction}</div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
};

// Card 하위 컴포넌트들
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 pt-6 pb-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 pb-6 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;