
import React from 'react';

type AuthContainerProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const AuthContainer: React.FC<AuthContainerProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div 
        id="auth-container"
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg"
        tabIndex={-1}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
