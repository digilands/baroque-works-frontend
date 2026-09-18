import { redirect } from "next/navigation";
import DisputeForm from "@/app/ui/disputes/DisputeForm";
import { getSessionUser } from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function NewDisputePage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  const { serviceId } = await searchParams;
  return <DisputeForm serviceId={serviceId ?? ""} />;
}
