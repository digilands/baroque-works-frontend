import JobsList from "@/app/ui/jobs/JobsList";
import { getCategories, getJobs } from "@/lib/server/queries";
import { mapJobToListItem } from "@/lib/server/mappers";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [{ jobs }, categories] = await Promise.all([getJobs({ limit: 20 }), getCategories()]);
  const categoryNames = Object.fromEntries(
    categories.flatMap((category) => category._id && category.displayName ? [[category._id, category.displayName]] : []),
  );
  return <JobsList jobs={jobs.map((job) => mapJobToListItem(job, categoryNames[job.category]))} categoryNames={categoryNames} />;
}
