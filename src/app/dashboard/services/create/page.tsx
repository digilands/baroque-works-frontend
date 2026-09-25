import { redirect } from "next/navigation";
import ServiceCreateForm from "@/app/ui/services/ServiceCreateForm";
import { getMyHandymanProfile } from "@/lib/server/queries";
import { requireSessionUser } from "@/lib/server/session-guard";

// Only handymen list services.
export const dynamic = "force-dynamic";

export default async function CreateServicePage() {
  const user = await requireSessionUser("/dashboard/services/create");
  if (user.role !== "handyman") redirect("/dashboard");
  const profile = await getMyHandymanProfile();
  if (!profile?._id) redirect("/auth/serviceselection");
  return <ServiceCreateForm handymanId={profile._id} />;
}
