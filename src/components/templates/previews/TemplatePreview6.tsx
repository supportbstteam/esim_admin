import { FiImage } from "react-icons/fi";

export default function Template6Preview() {
  return (
    <div className="h-24 w-full border rounded bg-white p-2">
      <div
        className="
          h-full w-full
          border-2 border-dashed border-green-300
          rounded
          flex flex-col items-center justify-center
          gap-1
        "
      >
        <FiImage className="text-gray-400" size={16} />
        <span className="text-[10px] text-gray-400">
          Full-width image
        </span>
      </div>
    </div>
  );
}
