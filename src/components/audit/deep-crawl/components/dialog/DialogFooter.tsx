
import React from 'react';
import { ArrowRight, BarChart4, Bot } from 'lucide-react';
import { DialogFooter as ShadcnDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  isCompleted: boolean;
  activeTab: string;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  isCompleted,
  activeTab,
  onClose,
  onTabChange
}) => {
  return (
    <ShadcnDialogFooter className="flex justify-between items-center sm:justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
      >
        Закрыть
      </Button>
      
      {isCompleted && (
        <div className="flex items-center gap-2">
          {activeTab === "progress" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onTabChange("results")}
              className="gap-2"
            >
              <BarChart4 className="h-4 w-4" />
              Результаты
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
          
          {activeTab === "results" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onTabChange("optimize")}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Оптимизировать
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
          
          {activeTab === "optimize" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onTabChange("progress")}
              className="gap-2"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Вернуться
            </Button>
          )}
        </div>
      )}
    </ShadcnDialogFooter>
  );
};

export default DialogFooter;
