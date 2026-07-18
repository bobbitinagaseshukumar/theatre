import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Application render failure:", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-primary">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-cpm-muted">
          The cinema experience hit an unexpected state. Refreshing will reload the latest booking data.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-cpm bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-bold text-white shadow-redGlow"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Reload
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
