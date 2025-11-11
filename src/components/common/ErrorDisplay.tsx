interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 my-6 max-w-2xl mx-auto">
      <div className="flex items-start">
        <div className="text-4xl mr-4">⚠️</div>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
