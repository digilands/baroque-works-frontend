"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import SelectInput from "@/app/ui/SelectInput";
import Button from "@/app/ui/Button";
import ImageUploader from "@/components/ui/ImageUploader";
import { HugeiconsIcon } from "@hugeicons/react";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import { useCreateDispute } from "@/hooks/useMarketplace";
import type { DisputeReason, UploadedFile } from "@/lib/api";

const REASONS: { value: DisputeReason; label: string }[] = [
  { value: "POOR_QUALITY", label: "Poor quality work" },
  { value: "DELAYED_WORK", label: "Delayed work" },
  { value: "UNFINISHED_TASK", label: "Unfinished task" },
  { value: "PAYMENT_ISSUE", label: "Payment issue" },
  { value: "UNPROFESSIONAL_BEHAVIOR", label: "Unprofessional behavior" },
];

interface DisputeFormValues {
  serviceId: string;
  reason: DisputeReason | "";
  description: string;
}

const validationSchema = Yup.object({
  serviceId: Yup.string().required("Service ID is required"),
  reason: Yup.string()
    .oneOf(REASONS.map((r) => r.value))
    .required("Reason is required"),
  description: Yup.string().min(10, "At least 10 characters").required("Description is required"),
});

/** Raise a dispute about a service, with photo evidence. */
export default function DisputeForm({ serviceId }: { serviceId: string }) {
  const createDispute = useCreateDispute();
  const [evidence, setEvidence] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState("");
  const [disputeId, setDisputeId] = useState<string | undefined>(undefined);

  const handleSubmit = async (values: DisputeFormValues) => {
    setFormError("");
    try {
      const result = await createDispute.mutateAsync({
        serviceId: values.serviceId.trim(),
        reason: values.reason as DisputeReason,
        description: values.description.trim(),
        evidence: evidence.map((f) => ({
          public_id: f.publicId,
          url: f.secureUrl || f.url,
          type: "IMAGE" as const,
        })),
      });
      setDisputeId(result.id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  if (disputeId !== undefined) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HugeiconsIcon icon={Tick02Icon} size={28} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dispute submitted</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Our team will review the evidence and respond. Keep this reference for
          follow-up: <span className="font-mono font-bold text-gray-900">#{disputeId.slice(-8)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Report an issue</h1>
      <p className="text-sm text-gray-500 mb-8">
        Tell us what went wrong — attach photos so our team can act fast.
      </p>

      {(formError || createDispute.error) && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {formError || createDispute.error?.message}
        </div>
      )}

      <Formik<DisputeFormValues>
        initialValues={{ serviceId, reason: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <TextInput label="Service ID" name="serviceId" required placeholder="Service reference" />
            <SelectInput
              label="Reason"
              name="reason"
              required
              options={REASONS.map((r) => ({ value: r.value, label: r.label }))}
            />
            <TextInput
              label="Description"
              name="description"
              required
              multiline
              rows={5}
              placeholder="What happened? When? What would resolve it?"
            />
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Evidence photos</p>
              <ImageUploader folder="user-jobs" onChange={setEvidence} />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full py-4" loading={isSubmitting || createDispute.isPending}>
                Submit dispute
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
