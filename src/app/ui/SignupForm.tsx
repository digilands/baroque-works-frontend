"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Mail01Icon, 
  AppleIcon, 
  GoogleIcon,
  ArrowRight01Icon 
} from "@hugeicons/core-free-icons";

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
      router.push("/auth/serviceselection");
    },
  });

  return (
    <div className="flex flex-col justify-center bg-white p-8 md:p-12 w-full max-w-md mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Create Account</h1>
        <p className="text-gray-500 text-sm">
          Join BaroqueWorks to manage your service requests with ease.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="emailOrPhone" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Email or Phone
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HugeiconsIcon icon={Mail01Icon} size={20} />
            </div>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              placeholder="e.g. emeka@homehero.com"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                formik.touched.emailOrPhone && formik.errors.emailOrPhone
                  ? "border-red-200 focus:ring-red-100/50"
                  : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
              }`}
              value={formik.values.emailOrPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
            <p className="text-xs text-red-500 ml-1 font-medium">{formik.errors.emailOrPhone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-[0.98] disabled:opacity-70"
        >
          {formik.isSubmitting ? "Creating..." : "Continue"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-100"></div>
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <HugeiconsIcon icon={GoogleIcon} size={20} />
          Sign up with Google
        </button>

        <button
          className="w-full py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <HugeiconsIcon icon={AppleIcon} size={20} />
          Sign up with Apple
        </button>
      </div>

      <p className="text-sm text-center mt-10 text-gray-500">
        Already have an account?{" "}
        <a href="/auth/login" className="text-indigo-600 font-bold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
