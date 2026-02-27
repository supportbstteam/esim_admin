export default function Template8Preview() {
  return (
    <div className="w-full bg-white border rounded overflow-hidden p-4 space-y-4 shadow-sm">
      
      {/* Simulation of a Heading */}
      <div className="h-5 w-3/4 bg-blue-100 rounded-md animate-pulse" />

      {/* Simulation of Paragraph Lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Simulation of an Image with Resizing Handles Look */}
      {/* <div className="relative h-24 w-1/2 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
        <div className="text-[10px] text-gray-400 font-bold uppercase">Image Content</div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-sm" />
      </div> */}

      {/* More Text Lines */}
      {/* <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-gray-200 rounded animate-pulse" />
      </div> */}

      {/* Label for the User */}
      <div className="pt-2 flex justify-between items-center border-t border-gray-50">
        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">Full Rich Text Editor</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

    </div>
  );
}
