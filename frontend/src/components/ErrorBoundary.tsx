"use client";

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/20 bg-rose-300/10">
            <AlertTriangle className="h-8 w-8 text-rose-300" />
          </div>
          <h3 className="mb-2 text-2xl text-white">
            {this.props.fallbackTitle || 'Something went wrong'}
          </h3>
          <p className="mb-6 max-w-md mx-auto text-sm text-slate-300">
            {this.props.fallbackDescription || 'An unexpected error occurred. Please try again.'}
          </p>
          {this.state.error && (
            <div className="mb-6 mx-auto max-w-md rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-mono text-slate-400 break-all">
                {this.state.error.message}
              </p>
            </div>
          )}
          <button onClick={this.handleRetry} className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
