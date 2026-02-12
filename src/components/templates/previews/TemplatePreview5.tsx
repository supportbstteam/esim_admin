import { FiPlus } from "react-icons/fi";

export default function Template5Preview() {
  return (
    <div className="h-24 w-full border rounded bg-white p-3 space-y-2">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <div className="h-3 w-2/3 bg-green-300 rounded" />
        <FiPlus className="text-gray-500" size={14} />
      </div>

      {/* COLLAPSED CONTENT PREVIEW */}
      <div className="space-y-1">
        <div className="h-2 w-full bg-gray-300 rounded" />
        <div className="h-2 w-5/6 bg-gray-300 rounded" />
        <div className="h-2 w-3/4 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
