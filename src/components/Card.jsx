import React from "react";

export function Card({ 
  className = "", 
  children, 
  variant = "default",
  padding = "default",
  hover = true,
  ...props 
}) {
  const baseStyles = "bg-white rounded-xl border border-gray-200 transition-all duration-200";
  
  const variants = {
    default: "shadow-sm",
    elevated: "shadow-lg",
    outlined: "border-2 border-gray-300 shadow-none",
    glass: "bg-white/80 backdrop-blur-lg border-white/20",
  };
  
  const paddingStyles = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };
  
  const hoverStyles = hover ? "hover:shadow-lg hover:border-gray-300 hover:-translate-y-1" : "";
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}