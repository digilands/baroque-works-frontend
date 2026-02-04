"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Mail01Icon, 
  GoogleIcon,
  ArrowRight01Icon,
  UserIcon,
  LockPasswordIcon
} from "@hugeicons/core-free-icons";
import { internalApi } from "@/lib/auth";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      role: "Client",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await internalApi.post('/auth/signup', values);
        if (response.data.success) {
          router.push("/auth/login?registered=true");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    },
  });

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`;
  };

  return (
    <div className="flex flex-col justify-center bg-white p-8 md:p-12 w-full max-w-md mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Create Account</h1>
        <p className="text-gray-500 text-sm">
          Join BaroqueWorks to manage your service requests with ease.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullname" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HugeiconsIcon icon={UserIcon} size={20} />
            </div>
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Emeka Obi"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                formik.touched.fullname && formik.errors.fullname
                  ? "border-red-200 focus:ring-red-100/50"
                  : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
              }`}
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.fullname && formik.errors.fullname && (
            <p className="text-xs text-red-500 ml-1 font-medium">{formik.errors.fullname}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HugeiconsIcon icon={Mail01Icon} size={20} />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. emeka@homehero.com"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                formik.touched.email && formik.errors.email
                  ? "border-red-200 focus:ring-red-100/50"
                  : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-red-500 ml-1 font-medium">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HugeiconsIcon icon={LockPasswordIcon} size={20} />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-red-200 focus:ring-red-100/50"
                  : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-red-500 ml-1 font-medium">{formik.errors.password}</p>
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
          onClick={handleGoogleSignup}
          type="button"
          className="w-full py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <HugeiconsIcon icon={GoogleIcon} size={20} />
          Sign up with Google
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
