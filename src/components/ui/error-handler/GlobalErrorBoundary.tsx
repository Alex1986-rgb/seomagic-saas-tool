
import React, { ErrorInfo, useState, useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw, XOctagon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number | null;
}

const ERROR_RESET_TIMEOUT = 10000; // 10 seconds

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Error caught by GlobalErrorBoundary:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const { lastErrorTime, errorCount } = this.state;
    
    // Reset error count if last error was more than ERROR_RESET_TIMEOUT ago
    const newErrorCount = (lastErrorTime && now - lastErrorTime > ERROR_RESET_TIMEOUT) 
      ? 1 
      : errorCount + 1;
    
    this.setState({ 
      errorInfo,
      errorCount: newErrorCount,
      lastErrorTime: now
    });
    
    console.error("Uncaught error in GlobalErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    console.log("Attempting to reset error in GlobalErrorBoundary");
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      console.log("GlobalErrorBoundary rendering error state");
      // If the component has errored too many times in succession, show a more permanent error
      if (this.state.errorCount >= 3) {
        return this.props.fallback || <PermanentErrorFallback error={this.state.error} />;
      }
      return this.props.fallback || <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }
    
    console.log("GlobalErrorBoundary rendering children");
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAttemptingRecovery, setIsAttemptingRecovery] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up any recovery timers if component unmounts
      setIsAttemptingRecovery(false);
    };
  }, []);

  const handleRetry = async () => {
    console.log("Attempting recovery in ErrorFallback");
    setIsAttemptingRecovery(true);
    
    // Artificial delay to allow React to clean up any problematic state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    resetError();
    setIsAttemptingRecovery(false);
    
    toast({
      title: "Перезапуск приложения",
      description: "Перезапуск компонента после ошибки",
      duration: 3000
    });
  };

  const handleNavigateHome = () => {
    console.log("Navigating home from ErrorFallback");
    resetError();
    navigate('/');
    toast({
      title: "Навигация на главную",
      description: "Возврат на главную страницу",
      duration: 3000
    });
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Что-то пошло не так</h2>
      <p className="text-muted-foreground mb-4">
        Произошла непредвиденная ошибка в работе приложения
      </p>
      {error && (
        <div className="bg-muted/30 p-4 rounded-md text-sm mb-6 max-w-lg overflow-auto">
          <p className="font-mono">{error.message}</p>
        </div>
      )}
      <div className="flex gap-3">
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isAttemptingRecovery}
        >
          <RefreshCw className={`h-4 w-4 ${isAttemptingRecovery ? 'animate-spin' : ''}`} />
          {isAttemptingRecovery ? 'Восстановление...' : 'Повторить'}
        </Button>
        <Button onClick={handleNavigateHome} variant="default" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          На главную
        </Button>
      </div>
    </div>
  );
};

// More serious fallback for repeated errors
const PermanentErrorFallback: React.FC<{error: Error | null}> = ({ error }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleReset = () => {
    // Perform a full page refresh to reset all state
    console.log("Performing full page refresh in PermanentErrorFallback");
    window.location.href = '/';
    
    toast({
      title: "Полный сброс",
      description: "Выполняется полный перезапуск приложения",
      duration: 3000
    });
  };
  
  return (
    <Card className="p-6 max-w-md mx-auto my-12 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <XOctagon className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Критическая ошибка</h1>
        <p className="text-muted-foreground">
          Обнаружена повторяющаяся ошибка, которая препятствует нормальной работе приложения
        </p>
        {error && (
          <div className="bg-destructive/10 p-4 rounded-md text-sm mb-2 w-full overflow-auto text-left">
            <p className="font-mono">{error.message}</p>
          </div>
        )}
        <Button onClick={handleReset} variant="destructive" className="mt-4">
          Полный сброс приложения
        </Button>
      </div>
    </Card>
  );
};
