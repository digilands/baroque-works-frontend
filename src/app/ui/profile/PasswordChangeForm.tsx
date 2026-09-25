"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import Button from "@/app/ui/Button";
import PasswordChecklist from "@/components/ui/PasswordChecklist";
import { useResetPassword } from "@/hooks/useMarketplace";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "One uppercase letter")
    .matches(/[a-z]/, "One lowercase letter")
    .matches(/[0-9]/, "One number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "One special character")
    .required("New password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your new password"),
});

/** Authenticated password change → PUT /auth/password-reset. */
export default function PasswordChangeForm() {
  const resetPassword = useResetPassword();
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Change password</h2>
      <p className="text-sm text-gray-500 mb-6">Choose a new password for your account.</p>

      {(formError || resetPassword.error) && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {formError || resetPassword.error?.message}
        </div>
      )}
      {done && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-xl text-center font-bold">
          Password updated.
        </div>
      )}

      <Formik
        initialValues={{ password: "", confirm: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          setFormError("");
          setDone(false);
          try {
            await resetPassword.mutateAsync(values.password);
            resetForm();
            setDone(true);
          } catch (err) {
            setFormError(err instanceof Error ? err.message : "Update failed. Please try again.");
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-5">
            <TextInput label="New password" name="password" type="password" required placeholder="••••••••" />
            <PasswordChecklist password={values.password} />
            <TextInput label="Confirm password" name="confirm" type="password" required placeholder="••••••••" />
            <Button
              type="submit"
              variant="secondary"
              className="w-full py-4"
              loading={isSubmitting || resetPassword.isPending}
            >
              Update password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
