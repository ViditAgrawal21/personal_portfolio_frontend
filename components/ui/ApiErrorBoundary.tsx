import { useEffect, useState } from 'react';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

const DefaultErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Connection Error
    </h3>
    <p className="text-gray-600 mb-4 max-w-md">
      Unable to connect to the server. This might be due to network issues or server maintenance.
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export function ApiErrorBoundary({ children, fallback: Fallback = DefaultErrorFallback }: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('fetch')) {
        setError(new Error('Network connection failed'));
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  const retry = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError && error) {
    return <Fallback error={error} retry={retry} />;
  }

  return <>{children}</>;
}