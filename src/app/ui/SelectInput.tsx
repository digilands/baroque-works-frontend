import { useField } from "formik";

interface SelectInputProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export default function SelectInput({ 
  label, 
  options, 
  placeholder, 
  required = true,
  ...props 
}: SelectInputProps) {
  const [field, meta] = useField(props.name);

  return (
    <div className="w-full">
      <label
        htmlFor={props.name}
        className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>

      <div className="relative">
        <select
          {...field}
          className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
            meta.touched && meta.error
              ? "border-red-200 focus:ring-red-100/50"
              : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
          }`}
        >
          <option value="" disabled>
            {placeholder || "Select an option..."}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {meta.touched && meta.error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{meta.error}</p>
      )}
    </div>
  );
}
