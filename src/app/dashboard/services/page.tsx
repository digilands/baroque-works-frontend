import { redirect } from "next/navigation";
import ManageServicesList from "@/app/ui/services/ManageServicesList";
import {
  getMyHandymanProfile,
  getServicesFeed,
  getSessionUser,
} from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function MyServicesPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "handyman") redirect("/dashboard");

  const profile = await getMyHandymanProfile();
  if (!profile) redirect("/auth/serviceselection");

  const { items } = await getServicesFeed({ handymanId: profile._id, limit: 50 });
  return <ManageServicesList services={items} />;
}
