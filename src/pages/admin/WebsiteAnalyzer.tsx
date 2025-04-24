
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import AdminLayout from '@/pages/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentOptimizationAI from '@/components/audit/results/components/ContentOptimizationAI';

const WebsiteAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleOptimizationStart = () => {
    setIsAnalyzing(true);
  };

  const handleOptimizationComplete = (optimizationResults: any) => {
    setIsAnalyzing(false);
    setResults(optimizationResults);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Globe className="h-8 w-8" />
          Анализ сайта с помощью AI
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Введите URL сайта для анализа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => setUrl(url.trim())}
                disabled={!url.trim() || isAnalyzing}
              >
                Анализировать
              </Button>
            </div>
          </CardContent>
        </Card>

        {url && (
          <ContentOptimizationAI
            url={url}
            onOptimizationStart={handleOptimizationStart}
            onOptimizationComplete={handleOptimizationComplete}
          />
        )}

        {results && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Результаты анализа</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {results.recommendations?.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default WebsiteAnalyzer;
