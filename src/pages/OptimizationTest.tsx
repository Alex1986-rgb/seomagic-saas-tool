import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';

interface AuditTask {
  task_id: string;
  url: string;
  status: string;
  score: number | null;
  page_count: number | null;
}

interface OptimizationResult {
  optimized_pages: number;
  total_pages: number;
  improvements: Array<{
    url: string;
    original: any;
    recommendations: string;
    timestamp: string;
  }>;
  total_cost: number;
  estimated_score_improvement: number;
  completed_at: string;
}

export default function OptimizationTest() {
  const { toast } = useToast();
  const [audits, setAudits] = useState<AuditTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [optimizationId, setOptimizationId] = useState<string>('');
  const [optimizationStatus, setOptimizationStatus] = useState<string>('');
  const [resultData, setResultData] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Load completed audits
  useEffect(() => {
    loadAudits();
  }, []);

  // Poll optimization status
  useEffect(() => {
    if (!optimizationId || !isPolling) return;

    const interval = setInterval(() => {
      checkOptimizationStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [optimizationId, isPolling]);

  const loadAudits = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_tasks')
        .select(`
          id,
          url,
          status,
          audit_results!inner(score, page_count)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedAudits = data?.map((item: any) => ({
        task_id: item.id,
        url: item.url,
        status: item.status,
        score: item.audit_results?.[0]?.score || null,
        page_count: item.audit_results?.[0]?.page_count || null,
      })) || [];

      setAudits(formattedAudits);
      
      if (formattedAudits.length > 0 && !selectedTaskId) {
        setSelectedTaskId(formattedAudits[0].task_id);
      }
    } catch (error) {
      console.error('Error loading audits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load completed audits',
        variant: 'destructive',
      });
    }
  };

  const startOptimization = async () => {
    if (!selectedTaskId) {
      toast({
        title: 'Error',
        description: 'Please select an audit',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setOptimizationStatus('');
    setResultData(null);

    try {
      const { data, error } = await supabase.functions.invoke('optimization-start', {
        body: {
          task_id: selectedTaskId,
          options: {
            fixMetaTags: true,
            improveContent: true,
            improveStructure: true,
            contentQuality: 'premium',
            language: 'ru'
          }
        }
      });

      if (error) throw error;

      console.log('Optimization started:', data);

      setOptimizationId(data.optimization_id);
      setOptimizationStatus(data.status);
      setIsPolling(true);

      toast({
        title: 'Success',
        description: 'Optimization started successfully',
      });
    } catch (error) {
      console.error('Error starting optimization:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start optimization',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkOptimizationStatus = async () => {
    if (!optimizationId) return;

    try {
      const { data, error } = await supabase.functions.invoke('optimization-status', {
        body: { optimization_id: optimizationId }
      });

      if (error) throw error;

      console.log('Optimization status:', data);

      setOptimizationStatus(data.status);

      if (data.status === 'completed') {
        setResultData(data.result_data);
        setIsPolling(false);
        
        toast({
          title: 'Optimization Complete',
          description: `Optimized ${data.result_data?.optimized_pages || 0} pages`,
        });
      } else if (data.status === 'failed') {
        setIsPolling(false);
        
        toast({
          title: 'Optimization Failed',
          description: 'An error occurred during optimization',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setIsPolling(false);
    }
  };

  const getStatusIcon = () => {
    switch (optimizationStatus) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const selectedAudit = audits.find(a => a.task_id === selectedTaskId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Optimization Test</h1>
        <p className="text-muted-foreground">
          Test the full optimization cycle with Lovable AI
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Step 1: Select Audit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                1
              </span>
              Select Completed Audit
            </CardTitle>
            <CardDescription>
              Choose an audit to optimize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {audits.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No completed audits found. Run an audit first.
              </p>
            ) : (
              <div className="space-y-2">
                {audits.map((audit) => (
                  <Card
                    key={audit.task_id}
                    className={`cursor-pointer transition-colors ${
                      selectedTaskId === audit.task_id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedTaskId(audit.task_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {audit.url}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Score: {audit.score || 'N/A'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {audit.page_count || 0} pages
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Start Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                2
              </span>
              Start Optimization
            </CardTitle>
            <CardDescription>
              Launch AI-powered optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedAudit && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Selected:</p>
                <p className="text-sm text-muted-foreground truncate">
                  {selectedAudit.url}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    SEO Score: {selectedAudit.score}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {selectedAudit.page_count} pages
                  </Badge>
                </div>
              </div>
            )}

            <Button
              onClick={startOptimization}
              disabled={!selectedTaskId || isLoading || isPolling}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start AI Optimization
                </>
              )}
            </Button>

            {optimizationId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium capitalize">
                    Status: {optimizationStatus}
                  </span>
                </div>
                
                {isPolling && (
                  <div className="space-y-2">
                    <Progress value={undefined} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Processing with Lovable AI (google/gemini-2.5-flash)...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Step 3: Results */}
      {resultData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                3
              </span>
              AI Optimization Results
            </CardTitle>
            <CardDescription>
              Review recommendations and metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pages Optimized</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultData.optimized_pages}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Pages</p>
                  <p className="text-2xl font-bold">
                    {resultData.total_pages}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Est. Score +</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{resultData.estimated_score_improvement}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${resultData.total_cost.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                AI Recommendations ({resultData.improvements.length} pages)
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {resultData.improvements.map((improvement, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate mb-1">
                            {improvement.url}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>Title: {improvement.original.title || 'N/A'}</span>
                            <span>•</span>
                            <span>Words: {improvement.original.word_count}</span>
                            <span>•</span>
                            <span>H1s: {improvement.original.h1_count}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2">
                          Page {index + 1}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">AI Recommendations:</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {improvement.recommendations}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
