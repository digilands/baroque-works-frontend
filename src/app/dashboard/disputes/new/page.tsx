import DisputeForm from "@/app/ui/disputes/DisputeForm";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function NewDisputePage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  await requireSessionUser("/dashboard/disputes/new");
  const { serviceId } = await searchParams;
  return <DisputeForm serviceId={serviceId ?? ""} />;
}
