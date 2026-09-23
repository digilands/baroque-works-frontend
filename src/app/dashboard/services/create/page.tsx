import { redirect } from "next/navigation";
import ServiceCreateForm from "@/app/ui/services/ServiceCreateForm";
import { getMyHandymanProfile, getSessionUser } from "@/lib/server/queries";

// Only handymen list services.
export const dynamic = "force-dynamic";

export default async function CreateServicePage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "handyman") redirect("/dashboard");
  const profile = await getMyHandymanProfile();
  if (!profile?._id) redirect("/auth/serviceselection");
  return <ServiceCreateForm handymanId={profile._id} />;
}
