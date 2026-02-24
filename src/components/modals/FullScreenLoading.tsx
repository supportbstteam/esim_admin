// components/ui/FullscreenLoader.tsx

"use client";

export default function FullscreenLoader({
  text = "Loading CMS Editor..."
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-700 font-semibold text-lg">
          {text}
        </p>

      </div>

    </div>
  );
}