import { useField } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  type?: string;
  maxLength?: number;
  /** When set with maxLength, shows a live "{n} characters left" counter. */
  showCount?: boolean;
}

export default function TextInput({
  label,
  multiline,
  rows = 3,
  required,
  showCount = false,
  ...props
}: TextInputProps) {
  const [field, meta] = useField(props.name);
  const length = String(field.value ?? "").length;
  const remaining =
    props.maxLength != null ? Math.max(props.maxLength - length, 0) : null;

  return (
    <div className="w-full">
      <label
        htmlFor={props.name}
        className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          {...field}
          placeholder={props.placeholder}
          name={props.name}
          required={required}
          rows={rows}
          maxLength={props.maxLength}
          className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all resize-none ${
            meta.touched && meta.error
              ? "border-red-200 focus:ring-red-100/50"
              : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
          }`}
        />
      ) : (
        <input
          {...field}
          {...props}
          className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
            meta.touched && meta.error
              ? "border-red-200 focus:ring-red-100/50"
              : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
          }`}
        />
      )}
      
      {meta.touched && meta.error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{meta.error}</p>
      )}
      {showCount && remaining !== null && (
        <p className="text-xs text-gray-400 mt-1 mr-1 font-medium text-right">
          {remaining} character{remaining === 1 ? "" : "s"} left
        </p>
      )}
    </div>
  );
}
