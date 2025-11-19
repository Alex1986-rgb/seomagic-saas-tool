
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuditContentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AuditContentErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 m-4 bg-card/90 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
            <h2 className="text-2xl font-bold">Ошибка отображения результатов</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {this.state.error?.message || 'Произошла неожиданная ошибка при отображении результатов аудита.'}
            </p>
            <div className="pt-4">
              <Button onClick={this.handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Попробовать снова
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
