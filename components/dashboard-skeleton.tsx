/**
 * Skeleton Loader for Dashboard Components
 * Provides a loading state while data is being fetched
 */

export default function DashboardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 animate-pulse" />
          <div className="ml-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}