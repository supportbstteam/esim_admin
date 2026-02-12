export default function Template2Preview() {
  return (
    <div className="h-24 w-full bg-white border rounded overflow-hidden flex">
      {/* LEFT – TEXT */}
      <div className="w-1/2 p-2 space-y-1">
        <div className="h-3 w-8 bg-gray-300 rounded-full" /> {/* step */}
        <div className="h-3 w-full bg-green-300 rounded" />
        <div className="h-2 w-full bg-gray-300 rounded" />
        <div className="h-2 w-3/4 bg-gray-300 rounded" />
      </div>

      {/* RIGHT – IMAGE */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">
        Image
      </div>
    </div>
  );
}
