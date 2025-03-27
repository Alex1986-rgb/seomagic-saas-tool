
import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileNavButtonProps {
  children: React.ReactNode;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: React.ReactNode;
}

const ProfileNavButton: React.FC<ProfileNavButtonProps> = ({ 
  children, 
  active, 
  icon, 
  onClick,
  badge
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-md transition-colors',
        active 
          ? 'bg-primary/10 text-primary hover:bg-primary/15' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <span className={cn('', active ? 'text-primary' : 'text-muted-foreground')}>
        {icon}
      </span>
      <span className="flex-grow text-left">{children}</span>
      {badge && <span>{badge}</span>}
    </button>
  );
};

export default ProfileNavButton;
