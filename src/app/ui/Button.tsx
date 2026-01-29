import React from "react";
import { cn } from "@/utils/cn"; // helper for merging classNames 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center";

  const variants = {
    primary:
      "bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-gray-100 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500",
    secondary:
      "bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98]",
    ghost:
      "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98]",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
