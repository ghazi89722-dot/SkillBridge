import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

    let variantStyles = "";
    if (variant === 'default') variantStyles = "bg-primary text-button-text hover:bg-primary/90";
    if (variant === 'outline') variantStyles = "border border-border bg-transparent hover:bg-border/20 text-text-primary";
    if (variant === 'ghost') variantStyles = "hover:bg-border/30 text-text-primary";
    if (variant === 'link') variantStyles = "text-primary underline-offset-4 hover:underline";

    let sizeStyles = "";
    if (size === 'default') sizeStyles = "h-10 px-4 py-2";
    if (size === 'sm') sizeStyles = "h-9 px-3 text-xs";
    if (size === 'lg') sizeStyles = "h-11 px-8";
    if (size === 'icon') sizeStyles = "h-10 w-10";

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
