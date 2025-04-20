
import React from 'react';
import {
  DropdownMenuItem,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";

interface ExportActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ExportAction: React.FC<ExportActionProps> = ({
  icon,
  label,
  onClick,
  loading = false,
  disabled = false,
  className = ""
}) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {loading && (
        <DropdownMenuShortcut>
          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></div>
        </DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  );
};
