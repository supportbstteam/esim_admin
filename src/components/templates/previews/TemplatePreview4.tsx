export default function Template4Preview() {
  return (
    <div className="h-24 w-full border rounded bg-white p-2">
      <div className="grid grid-cols-4 gap-2 h-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border rounded p-1 flex flex-col gap-1"
          >
            {/* ICON */}
            <div className="h-3 w-3 bg-gray-300 rounded" />

            {/* TITLE */}
            <div className="h-2 w-full bg-green-300 rounded" />

            {/* DESCRIPTION */}
            <div className="h-2 w-full bg-gray-300 rounded" />
            <div className="h-2 w-3/4 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
