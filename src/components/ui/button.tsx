import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon";
}

const variantClasses: Record<string, string> = {
  default: "bg-[#4caf50] text-white hover:bg-[#43a047]",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "hover:bg-gray-100 text-gray-700",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  link: "text-[#4caf50] underline-offset-4 hover:underline",
};

const sizeClasses: Record<string, string> = {
  default: "h-9 px-4 py-2",
  xs: "h-6 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  lg: "h-11 px-8 text-base",
  icon: "h-9 w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantClasses[variant] || variantClasses.default,
          sizeClasses[size] || sizeClasses.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
