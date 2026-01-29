"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Google, Apple } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
    },
    validationSchema: Yup.object({
      emailOrPhone: Yup.string()
        .required("Email or phone number is required")
        .matches(
          /^(\+?\d{10,14}|[^@]+@[^@]+\.[^@]+)$/,
          "Enter a valid email or phone"
        ),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      router.push("/auth/serviceselection")
    },
  });

  return (
    <div className="flex flex-col justify-center h-full bg-bg text-text p-8 rounded-l-2xl w-[23rem]">
      <h1 className="text-xl font-semibold mb-1 text-center text-dark">Get started with BaroqueWorks</h1>
      <p className="text-gray-text3 mb-6 text-sm text-center">
        Create an account to get started
      </p>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

        <TextField
          id="emailOrPhone"
          name="emailOrPhone"
          label="Enter Email or Phone Number"
          placeholder="e.g. Handyman@homehero.com"
          variant="outlined"
          size="small"
          value={formik.values.emailOrPhone}
          onChange={formik.handleChange}
          error={formik.touched.emailOrPhone && Boolean(formik.errors.emailOrPhone)}
          helperText={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
          InputProps={{
            className:
              "!bg-bg !text-text !rounded-lg ",
          }}
          fullWidth

          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-text)', // focused border color adapts to theme
              }
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: 'var(--color-text)', // focused label color adapts to theme
              }
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="w-full py-2 bg-text hover:bg-[#1a1a1a] dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white rounded-lg normal-case font-medium"

        >
          Continue
        </Button>
      </form>

      <div className="flex items-center gap-2 my-4">
        <Divider className="flex-1" />
        <span className="text-gray-text3 text-xs">or</span>
        <Divider className="flex-1" />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          startIcon={<Google />}
          variant="outlined"
          className="w-full py-2 text-dark border-text normal-case rounded-lg"

        >
          Sign up with Google
        </Button>

        <Button
          startIcon={<Apple />}
          variant="outlined"
          fullWidth
          className="w-full py-2 text-dark border-text normal-case rounded-lg"

        >
          Sign up with Apple
        </Button>
      </div>

      <p className="text-sm text-center mt-6">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
