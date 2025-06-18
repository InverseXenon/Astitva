import React from "react";

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className, 
  children, 
  disabled = false,
  asChild = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    default: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    primary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:border-purple-700',
    ghost: 'text-purple-600 hover:bg-purple-50',
    link: 'text-purple-600 underline-offset-4 hover:underline',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  // Combine classes manually
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`.trim();

  // If asChild is true, clone the child element with button props
  if (asChild && React.Children.count(children) === 1) {
    return React.cloneElement(children, {
      className: combinedClassName,
      disabled,
      ...props,
    });
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}