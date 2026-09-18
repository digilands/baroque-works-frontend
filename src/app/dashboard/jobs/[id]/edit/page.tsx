import { redirect } from "next/navigation";
import JobCreateForm from "@/app/ui/jobs/JobCreateForm";
import {
  getJobById,
  getMyHirerProfile,
  getSessionUser,
} from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "client") redirect("/dashboard");

  const [hirer, job] = await Promise.all([
    getMyHirerProfile(),
    getJobById(id).catch(() => null),
  ]);
  // Owner-only: clients may edit just their own open postings.
  if (!job || !hirer || job.hirerId !== hirer._id) redirect("/dashboard/jobs");
  if (job.status !== "OPEN") redirect(`/dashboard/jobs/${id}`);

  const coords = job.location?.coordinates;
  return (
    <JobCreateForm
      jobId={job._id ?? id}
      initial={{
        title: job.title ?? "",
        description: job.description ?? "",
        category: job.category ?? "",
        minBudget: job.budget?.min ?? 0,
        maxBudget: job.budget?.max ?? 0,
        urgency: (job.urgency ?? "NORMAL") as "URGENT" | "NORMAL" | "FLEXIBLE",
        location:
          Array.isArray(coords) && coords.length === 2
            ? { latitude: coords[1] as number, longitude: coords[0] as number }
            : null,
      }}
    />
  );
}
