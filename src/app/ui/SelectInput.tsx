import { useField } from "formik";
import StyledSelect, { type StyledSelectOption } from "@/components/ui/StyledSelect";

interface SelectInputProps {
  label: string;
  name: string;
  options: string[] | { value: string; label: string }[];
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
  const [field, meta, helpers] = useField(props.name);

  const selectOptions: StyledSelectOption[] = options.map((opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    const text =
      typeof opt === "string"
        ? opt.charAt(0).toUpperCase() + opt.slice(1)
        : opt.label;
    return { value, label: text };
  });

  return (
    <div className="w-full">
      <label
        htmlFor={props.name}
        className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>

      <StyledSelect
        id={props.name}
        name={props.name}
        value={field.value ?? ""}
        onChange={(v) => helpers.setValue(v)}
        options={selectOptions}
        placeholder={placeholder || "Select an option..."}
        aria-label={label}
        className="w-full"
        triggerClassName={
          meta.touched && meta.error
            ? "border-red-200 focus:ring-red-100/50"
            : undefined
        }
      />

      {meta.touched && meta.error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{meta.error}</p>
      )}
    </div>
  );
}
