
import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormGroup({
  label,
  htmlFor,
  error,
  className,
  children
}: FormGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={htmlFor}
          className={cn(
            "block text-sm font-medium",
            error && "text-destructive"
          )}
        >
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
