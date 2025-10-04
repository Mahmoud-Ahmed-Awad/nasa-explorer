import React from "react";
import Icon from "./UI/Icon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="card">
              <Icon name="rocket" size={48} className="text-white mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-300 mb-6">
                We encountered an unexpected error. Our team has been notified
                and is working to fix it.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-neon-blue hover:text-neon-purple">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-4 bg-slate-800 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                    <pre>{this.state.error.toString()}</pre>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-slate-400">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full btn-primary"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: null,
                      errorInfo: null,
                    })
                  }
                  className="w-full btn-secondary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
