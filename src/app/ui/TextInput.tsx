import { TextField } from "@mui/material";
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
  ...props
}: TextInputProps) {
  const [field, meta] = useField(props.name);

  return (
    <div className="w-full mb-4">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-800 mb-1"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <TextField
        {...field}
        {...props}
        variant="outlined"
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        size="small"
        InputProps={{
          className:
            "!bg-bg !text-text !rounded-lg",
        }}

        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-text)', // focused border color adapts to theme
            }
          },

        }}
      />
    </div>
  );
}
