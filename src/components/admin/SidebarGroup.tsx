
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full mb-3"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <span className="text-xs">{open ? "▲" : "▼"}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarGroup;
