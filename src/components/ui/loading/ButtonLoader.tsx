
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonLoaderProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonLoader;
