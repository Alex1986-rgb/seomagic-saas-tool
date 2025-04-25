
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface BatchProcessingConfigProps {
  batchSize: number;
  setBatchSize: (value: number) => void;
  concurrency: number;
  setConcurrency: (value: number) => void;
  delay: number;
  setDelay: (value: number) => void;
}

const BatchProcessingConfig: React.FC<BatchProcessingConfigProps> = ({
  batchSize,
  setBatchSize,
  concurrency,
  setConcurrency,
  delay,
  setDelay
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="batch-settings">
        <AccordionTrigger className="text-sm">Настройки пакетной обработки</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="batch-size">Размер пакета: {batchSize}</Label>
                <Input 
                  id="batch-size-input"
                  type="number"
                  className="w-20"
                  min={1}
                  max={100}
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                />
              </div>
              <Slider
                id="batch-size"
                value={[batchSize]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setBatchSize(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Количество URL, обрабатываемых за один раз
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="concurrency">Параллельные запросы: {concurrency}</Label>
                <Input 
                  id="concurrency-input"
                  type="number"
                  className="w-20"
                  min={1}
                  max={20}
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value) || 5)}
                />
              </div>
              <Slider
                id="concurrency"
                value={[concurrency]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setConcurrency(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Количество одновременных запросов
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="delay">Задержка между запросами: {delay} мс</Label>
                <Input 
                  id="delay-input"
                  type="number"
                  className="w-20"
                  min={0}
                  max={5000}
                  step={100}
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value) || 500)}
                />
              </div>
              <Slider
                id="delay"
                value={[delay]}
                min={0}
                max={5000}
                step={100}
                onValueChange={(value) => setDelay(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Задержка между пакетами запросов в миллисекундах
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BatchProcessingConfig;
