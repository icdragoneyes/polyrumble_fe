export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-trader1 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="ml-4 text-gray-600 text-lg">Loading trader data...</p>
    </div>
  );
}
