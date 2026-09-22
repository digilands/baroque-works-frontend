import { redirect } from "next/navigation";
import JobCreateForm from "@/app/ui/jobs/JobCreateForm";
import { getSessionUser } from "@/lib/server/queries";

// Only clients post jobs; handymen browse them.
export const dynamic = "force-dynamic";

export default async function CreateJobPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "client") redirect("/dashboard");
  return <JobCreateForm />;
}
