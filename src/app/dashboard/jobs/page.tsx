import JobsList from "@/app/ui/jobs/JobsList";
import { getJobs } from "@/lib/server/queries";
import { mapJobToListItem } from "@/lib/server/mappers";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { jobs } = await getJobs({ limit: 20 });
  return <JobsList jobs={jobs.map(mapJobToListItem)} />;
}
