"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../ui/Button";
import TextInput from "../../ui/TextInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useUser } from "@/hooks/useAuth";
import { useUpdateMe } from "@/hooks/useOnboarding";

export default function AdditionalInfo() {
    const router = useRouter();
    const { data: sessionUser } = useUser();
    const updateMe = useUpdateMe();
    const [pushNotification, setPushNotification] = useState(false);
    const [formError, setFormError] = useState("");

    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .required("Phone number is required")
            .matches(/^\+?\d{10,14}$/, "Enter a valid phone number"),
    });

    const handleSubmit = async (values: { phoneNumber: string }) => {
        setFormError("");
        try {
            await updateMe.mutateAsync({ phone: values.phoneNumber });
            if (pushNotification && typeof window !== "undefined" && "Notification" in window) {
                try {
                    await Notification.requestPermission();
                } catch {
                    // permission prompt dismissed — non-blocking
                }
            }
            router.push(sessionUser?.role === "handyman" ? "/dashboard/jobs" : "/dashboard");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Update failed. Please try again.");
        }
    };

    const handleSkip = () => {
        router.push(sessionUser?.role === "handyman" ? "/dashboard/jobs" : "/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-text mb-2">
                    Additional info
                </h1>
                <p className="text-center text-muted-foreground mb-8 text-sm">
                    Add a phone number so clients can reach you
                </p>

                {(formError || updateMe.error) && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                        {formError || updateMe.error?.message}
                    </div>
                )}

                <Formik
                    initialValues={{
                        phoneNumber: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {/* Email (from session, read-only here) */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between bg-input border border-border rounded-lg px-4 py-3">
                                    <span className="text-text">{sessionUser?.email ?? "…"}</span>
                                </div>
                            </div>

                            {/* Push Notification Toggle */}
                            <div className="mb-6">
                                <label className="flex items-center justify-between cursor-pointer" onClick={() => setPushNotification(!pushNotification)}>
                                    <span className="text-text text-sm">
                                        Turn on push notification for the Email above
                                    </span>
                                    <div className="relative inline-flex items-center">
                                        <div
                                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${pushNotification ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 transition-transform duration-200 ${pushNotification ? "translate-x-5" : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Phone Number Input */}
                            <div className="mb-12">
                                <TextInput
                                    label="Add phone number"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="Phone number"
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    onClick={handleSkip}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Skip
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSubmitting || updateMe.isPending}
                                >
                                    {isSubmitting || updateMe.isPending ? "Submitting..." : "Next"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
