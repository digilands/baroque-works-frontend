import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api-errors";
import { JobHeader } from "@/app/ui/jobs/JobHeader";
import { LocationCard } from "@/app/ui/jobs/LocationCard";
import { TaskOverviewCard } from "@/app/ui/jobs/TaskOverviewCard";
import { ClientCard } from "@/app/ui/jobs/ClientCard";
import { SchedulePayCard } from "@/app/ui/jobs/SchedulePayCard";
import { JobActionFooter } from "@/app/ui/jobs/JobActionFooter";
import JobOwnerActions from "@/app/ui/jobs/JobOwnerActions";
import {
  getHirerById,
  getJobById,
  getUserById,
} from "@/lib/server/queries";
import {
  formatNaira,
  mapHirerToClient,
  mapJobToDetailBlocks,
} from "@/lib/server/mappers";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function JobRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireSessionUser(`/dashboard/jobs/${id}`);

  let job;
  try {
    job = await getJobById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  // Hirer -> user chain for the client card (best effort; card hidden on failure).
  const hirer = job.hirerId
    ? await getHirerById(job.hirerId).catch(() => null)
    : null;
  const client = await (async () => {
    if (!hirer) return null;
    const userId = typeof hirer.user === "string" ? hirer.user : "";
    if (!userId) return null;
    const hirerUser = await getUserById(userId).catch(() => null);
    return hirerUser ? mapHirerToClient(hirer, hirerUser) : null;
  })();

  const isOwner =
    user.role === "client" && hirer !== null && hirer._id === job.hirerId;

  const blocks = mapJobToDetailBlocks(job);

  // TODO (Phase 3): wire accept/decline to the proposal flow once the
  // backend contract for handyman job responses is confirmed.
  async function handleAccept() {
    "use server";
    console.log("Accepted job", id);
  }

  async function handleDecline() {
    "use server";
    console.log("Declined job", id);
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <JobHeader title={job.title ?? "Job request"} requestId={(job._id ?? id).slice(-6)} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Info */}
        <div className="lg:col-span-2">
          <TaskOverviewCard
            description={job.description ?? "No description provided."}
            photos={job.image?.map((image) => image.url).filter((url): url is string => Boolean(url)) ?? []}
            instructions={undefined}
          />

          {client && (
            <div className="block lg:hidden mb-8">
              <ClientCard client={client} />
            </div>
          )}

          <LocationCard location={blocks.location} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {client && (
            <div className="hidden lg:block">
              <ClientCard client={client} />
            </div>
          )}

          <SchedulePayCard
            requestedDate={blocks.requestedDate}
            requestedTime="—"
            financials={blocks.financials}
          />
        </div>
      </div>

      {isOwner ? (
        <JobOwnerActions jobId={job._id ?? id} />
      ) : (
        <JobActionFooter
          price={formatNaira(blocks.financials.total)}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
}
