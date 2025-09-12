// src/components/common/Button.tsx
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// CVA 기반 Button variants (shadcn/ui 스타일)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 기존 프로젝트 스타일 (Tailwind 직접 사용)
        primary:
          "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary:
          "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
        ghost:
          "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",

        // shadcn/ui 스타일 (dart-viewer용)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "shadcn-outline":
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "shadcn-secondary":
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        "shadcn-ghost":
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  } as const // ✅ 전체를 literal로 고정 (TS가 산술로 오해 방지)
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean; // Radix UI Slot 지원
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      asChild = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // CVA로 클래스 생성
    const baseClasses = buttonVariants({ variant, size });

    // 추가 클래스
    const additionalClasses = clsx(
      fullWidth && "w-full",
      loading && "cursor-not-allowed",
      className
    );

    // 최종 클래스 병합
    const finalClasses = twMerge(baseClasses, additionalClasses);

    return (
      <Comp
        className={finalClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>로딩중...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
