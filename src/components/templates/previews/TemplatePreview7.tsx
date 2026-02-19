export default function Template7Preview() {
  return (
    <div className="w-full bg-white border rounded overflow-hidden p-3 space-y-3">

      {/* Heading Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-green-300 rounded" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-3 gap-2">

        {/* Card 1 */}
        <div className="p-2 border rounded space-y-2">
          <div className="h-3 w-12 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-green-300 rounded" />
          <div className="h-3 w-3/4 bg-green-300 rounded" />
        </div>

        {/* Card 2 */}
        <div className="p-2 border rounded space-y-2">
          <div className="h-3 w-10 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-green-300 rounded" />
          <div className="h-3 w-2/3 bg-green-300 rounded" />
        </div>

        {/* Card 3 */}
        <div className="p-2 border rounded space-y-2">
          <div className="h-3 w-14 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-green-300 rounded" />
          <div className="h-3 w-1/2 bg-green-300 rounded" />
        </div>

      </div>

    </div>
  );
}
