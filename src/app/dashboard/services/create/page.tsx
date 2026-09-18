import { redirect } from "next/navigation";
import ServiceCreateForm from "@/app/ui/services/ServiceCreateForm";
import { getSessionUser } from "@/lib/server/queries";

// Only handymen list services.
export const dynamic = "force-dynamic";

export default async function CreateServicePage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "handyman") redirect("/dashboard");
  return <ServiceCreateForm />;
}
