// src/components/common/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Card, CardHeader, CardContent, CardFooter } from './Card';
export { default as Loading, Avatar, Badge } from './Loading';

// 타입들도 함께 내보내기
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { ModalProps } from './Modal';
export type { CardProps } from './Card';
export type { LoadingProps, AvatarProps, BadgeProps } from './Loading';