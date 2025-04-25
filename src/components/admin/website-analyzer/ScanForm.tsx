
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ScanFormProps {
  url: string;
  isScanning: boolean;
  scanProgress: number;
  scanStage: string;
  isError: boolean;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartScan: () => void;
}

const ScanForm = ({
  url,
  isScanning,
  scanProgress,
  scanStage,
  isError,
  onUrlChange,
  onStartScan
}: ScanFormProps) => {
  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Например: example.com"
          value={url}
          onChange={onUrlChange}
          className="flex-1"
        />
        <Button 
          onClick={onStartScan} 
          disabled={isScanning}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Сканировать
        </Button>
      </div>

      {isScanning && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{scanStage}</span>
            <span>{scanProgress}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
      )}

      {isError && !isScanning && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          Произошла ошибка при сканировании. Пожалуйста, проверьте URL и попробуйте снова.
        </div>
      )}
    </div>
  );
};

export default ScanForm;
