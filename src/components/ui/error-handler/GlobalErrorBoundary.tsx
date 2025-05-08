
import React, { ErrorInfo } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
    
    // Можно добавить отправку ошибки в систему логирования
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRetry = () => {
    resetError();
    toast({
      title: "Перезапуск приложения",
      description: "Перезапуск компонента после ошибки"
    });
  };

  const handleNavigateHome = () => {
    resetError();
    navigate('/');
    toast({
      title: "Навигация на главную",
      description: "Возврат на главную страницу"
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
        <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Повторить
        </Button>
        <Button onClick={handleNavigateHome} variant="default" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          На главную
        </Button>
      </div>
    </div>
  );
};

export default ErrorFallback;
