import React from "react";
export function Badge({ className, children }) {
    return (
      <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${className}`}>
        {children}
      </span>
    );
  }