import { redirect } from "next/navigation";
import ManageServicesList from "@/app/ui/services/ManageServicesList";
import {
  getMyHandymanProfile,
  getServiceById,
  getServicesFeed,
  type ServiceFeedItem,
} from "@/lib/server/queries";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function MyServicesPage() {
  const user = await requireSessionUser("/dashboard/services");
  if (user.role !== "handyman") redirect("/dashboard");

  const profile = await getMyHandymanProfile();
  if (!profile) redirect("/auth/serviceselection");

  const { items } = await getServicesFeed({ handymanId: profile._id, limit: 50 });
  // Feed projection may omit service.image — load full docs for the list thumbnails.
  const services: ServiceFeedItem[] = await Promise.all(
    items.map(async (item) => {
      if (!item._id || item.image?.length) return item;
      try {
        const full = await getServiceById(item._id);
        return { ...item, image: full.image };
      } catch {
        return item;
      }
    }),
  );
  return <ManageServicesList services={services} />;
}
