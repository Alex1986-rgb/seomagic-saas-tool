
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProfileNavButtonProps {
  active: boolean;
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  badge?: ReactNode;
  className?: string;
}

const ProfileNavButton: React.FC<ProfileNavButtonProps> = ({ 
  active, 
  icon, 
  children, 
  onClick,
  badge,
  className
}) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-primary/5 text-foreground",
        className
      )}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-grow">{children}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </button>
  );
};

export default ProfileNavButton;
