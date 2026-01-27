export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="h-4 w-32 bg-background-300 rounded mb-4"></div>
            <div className="h-8 w-64 bg-background-300 rounded mb-2"></div>
            <div className="h-6 w-24 bg-background-300 rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-background-300 rounded"></div>
            <div className="h-10 w-32 bg-background-300 rounded"></div>
            <div className="h-10 w-32 bg-background-300 rounded"></div>
            <div className="h-10 w-32 bg-background-300 rounded"></div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background-200 rounded-lg border border-background-400 p-6">
              <div className="h-4 w-24 bg-background-300 rounded mb-2"></div>
              <div className="h-8 w-16 bg-background-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Analytics skeleton */}
        <div className="bg-background-200 rounded-lg border border-background-400 p-6 mb-8">
          <div className="h-6 w-48 bg-background-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-background-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Entries table skeleton */}
        <div className="bg-background-200 rounded-lg border border-background-400 p-6">
          <div className="h-6 w-32 bg-background-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-background-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

