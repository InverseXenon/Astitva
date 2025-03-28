import React from "react";
export function Button({ variant = 'default', size = 'md', className, children, ...props }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2';
    const variants = {
      default: 'bg-purple-600 text-white hover:bg-purple-700',
      outline: 'border-2 border-current text-purple-600 hover:bg-purple-50',
    };
    const sizes = {
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }