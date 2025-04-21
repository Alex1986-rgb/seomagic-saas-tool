
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1 font-normal",
          active && "bg-primary/10 text-primary font-medium"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarLink;
