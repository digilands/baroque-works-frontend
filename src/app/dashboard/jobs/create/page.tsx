import { redirect } from "next/navigation";
import JobCreateForm from "@/app/ui/jobs/JobCreateForm";
import { requireSessionUser } from "@/lib/server/session-guard";

// Only clients post jobs; handymen browse them.
export const dynamic = "force-dynamic";

export default async function CreateJobPage() {
  const user = await requireSessionUser("/dashboard/jobs/create");
  if (user.role !== "client") redirect("/dashboard");
  return <JobCreateForm />;
}
