"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../ui/Button";
import TextInput from "../../ui/TextInput";
import { Formik, Form } from "formik";

export default function AdditionalInfo() {
    const router = useRouter();
    const [email] = useState("imadejohn@gmail.com");
    const [pushNotification, setPushNotification] = useState(false);

    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .required("Phone number is required")
            .matches(/^\+?\d{10,14}$/, "Enter a valid phone number"),
    });

    const handleSubmit = (values: { phoneNumber: string }) => {
        console.log("Additional Info:", {
            email,
            pushNotification,
            phoneNumber: values.phoneNumber
        });
        router.push("/");
    };

    const handleSkip = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-text mb-2">
                    Additional info
                </h1>
                <p className="text-center text-muted-foreground mb-8 text-sm">
                    Select Services that you offer
                </p>

                <Formik
                    initialValues={{
                        phoneNumber: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {/* Email Field with Edit Button */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between bg-input border border-border rounded-lg px-4 py-3">
                                    <span className="text-text">{email}</span>
                                    <button type="button" className="text-muted-foreground hover:text-text text-sm">
                                        Edit
                                    </button>
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Next"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
