import { useField } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  type?: string;
}

export default function TextInput({
  label,
  multiline,
  rows = 3,
  required,
  ...props
}: TextInputProps) {
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
      
      {multiline ? (
        <textarea
          {...field}
          {...(props as any)}
          rows={rows}
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
    </div>
  );
}
