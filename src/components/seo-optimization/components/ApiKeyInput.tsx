
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const ApiKeyInput: React.FC = () => {
  return (
    <Alert className="bg-primary/10 border border-primary/20">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      <AlertDescription className="text-foreground">
        AI функции настроены через Lovable AI
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyInput;
