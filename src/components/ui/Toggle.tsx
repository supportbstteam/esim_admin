export const Toggle = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    className={`relative w-12 h-6 cursor-pointer bg-gray-300 rounded-full p-1 transition-colors duration-200 
      ${checked ? "bg-green-500" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={() => !disabled && onChange(!checked)}
    aria-pressed={checked}
    disabled={disabled}
    type="button"
  >
    <span
      className={`absolute top-0 left-0 h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-0"
        }`}
    />
  </button>
);