import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

export default function DateField({
  label,
  value,
  onChange,
  placeholder = "Select date",
  error,
  required,
  showTimeSelect,
  isClearable = true,
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-main">
          {label} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={value}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat={showTimeSelect ? "MMM d, yyyy h:mm aa" : "MMM d, yyyy"}
          showTimeSelect={showTimeSelect}
          isClearable={isClearable}
          className="pl-9"
          popperPlacement="bottom-start"
          {...rest}
        />
        <Calendar
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10"
        />
      </div>
      {error && <span className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</span>}
    </div>
  );
}
