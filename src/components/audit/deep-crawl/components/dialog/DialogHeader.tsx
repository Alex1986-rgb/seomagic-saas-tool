import React from 'react';
import { FileSearch } from 'lucide-react';
import { DialogHeader as ShadcnDialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  title: string;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title }) => {
  return (
    <ShadcnDialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <FileSearch className="h-5 w-5 text-primary" />
        {title}
      </DialogTitle>
    </ShadcnDialogHeader>
  );
};

export default DialogHeader;
