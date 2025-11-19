import { MenuItem, Select, FormHelperText } from "@mui/material";
import { useField } from "formik";

interface SelectInputProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
}

export default function SelectInput({ label, options, ...props }: SelectInputProps) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <div className="w-full mb-4">
     
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-800 mb-1"
      >
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>

        <Select
          labelId={`${props.name}-label`}
          id={props.name}
          {...field}
          onChange={(e) => helpers.setValue(e.target.value)}
          displayEmpty
          className="!rounded-lg !bg-bg !text-gray-800 w-full h-[2.5rem]"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          }}
        >
          <MenuItem disabled value="">
            <span className="text-gray-400">
              {props.placeholder || "Select an option"}
            </span>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>

        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
    </div>
  );
}
