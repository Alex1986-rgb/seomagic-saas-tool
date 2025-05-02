
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PingForm, { DEFAULT_RPC_SERVICES } from './ping-service/PingForm';
import { usePingService } from './ping-service/usePingService';
import PingResults from './ping-service/PingResults';
import PingResultsChart from './ping-service/PingResultsChart';
import PingServiceHeader from './ping-service/PingServiceHeader';

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

  // Вычисляем статистику
  const successfulPings = pingResults.filter(r => r.success).length;
  const totalPings = pingResults.length;
  const successRate = totalPings > 0 ? Math.round((successfulPings / totalPings) * 100) : 0;

  // Эффективность RPC-сервисов
  const rpcStats = React.useMemo(() => {
    const stats = new Map<string, { success: number, total: number }>();
    
    pingResults.forEach(result => {
      const rpc = result.rpc;
      const currentStats = stats.get(rpc) || { success: 0, total: 0 };
      
      if (result.success) {
        currentStats.success++;
      }
      
      currentStats.total++;
      stats.set(rpc, currentStats);
    });
    
    return Array.from(stats.entries()).map(([rpc, data]) => ({
      rpc: rpc.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      success: data.success,
      total: data.total,
      rate: Math.round((data.success / data.total) * 100)
    }));
  }, [pingResults]);

  return (
    <Card>
      <PingServiceHeader />
      
      <CardContent className="space-y-8 pt-2">
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
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Статистика результатов</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PingResultsChart
                  successCount={successfulPings}
                  errorCount={totalPings - successfulPings}
                />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Эффективность RPC-сервисов</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">RPC-сервис</th>
                          <th className="text-right py-2">Успешно</th>
                          <th className="text-right py-2">Всего</th>
                          <th className="text-right py-2">% успеха</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rpcStats.map((stat, index) => (
                          <tr key={index} className="border-b border-dashed">
                            <td className="py-2">{stat.rpc}</td>
                            <td className="text-right py-2">{stat.success}</td>
                            <td className="text-right py-2">{stat.total}</td>
                            <td className="text-right py-2">{stat.rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <PingResults
              results={pingResults}
              onClearResults={clearResults}
              successCount={successfulPings}
              errorCount={totalPings - successfulPings}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PingService;
