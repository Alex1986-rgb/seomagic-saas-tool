
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PingForm, 
  PingResults, 
  PingServiceHeader,
  PingResultsChart,
  usePingService 
} from './ping-service';

const PingService: React.FC = () => {
  const { 
    pingResults, 
    isLoading, 
    progress, 
    batchSize,
    setBatchSize,
    concurrency,
    setConcurrency,
    delay,
    setDelay,
    handleStartPing, 
    clearResults 
  } = usePingService();

  return (
    <Card className="w-full">
      <PingServiceHeader />
      
      <CardContent>
        <div className="space-y-6">
          {pingResults.length === 0 && !isLoading && (
            <Alert>
              <AlertDescription>
                Введите данные и нажмите кнопку "Начать пинг" для уведомления поисковых систем о новом контенте.
              </AlertDescription>
            </Alert>
          )}
          
          <PingForm 
            onStartPing={handleStartPing}
            isLoading={isLoading}
            progress={progress}
            batchSize={batchSize}
            setBatchSize={setBatchSize}
            concurrency={concurrency}
            setConcurrency={setConcurrency}
            delay={delay}
            setDelay={setDelay}
          />
          
          {pingResults.length > 0 && (
            <>
              <PingResultsChart results={pingResults} />
              <PingResults 
                results={pingResults}
                onClear={clearResults}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PingService;
