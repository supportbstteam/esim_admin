export default function Template1Preview() {
  return (
    <div className="h-24 w-full bg-white border rounded flex overflow-hidden">
      {/* LEFT */}
      <div className="w-1/2 p-2 space-y-1">
        <div className="h-2 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-full bg-green-300 rounded" />
        <div className="h-3 w-3/4 bg-green-300 rounded" />
      </div>

      {/* RIGHT */}
      <div className="w-1/2 p-2 space-y-1">
        <div className="h-2 w-full bg-gray-300 rounded" />
        <div className="h-2 w-full bg-gray-300 rounded" />
        <div className="h-2 w-2/3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
