import { redirect } from "next/navigation";
import ServiceCreateForm from "@/app/ui/services/ServiceCreateForm";
import {
  getMyHandymanProfile,
  getServiceById,
  getSessionUser,
} from "@/lib/server/queries";
import { toDateTimeLocalValue } from "@/lib/server/mappers";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  if (user.role !== "handyman") redirect("/dashboard");

  const [profile, service] = await Promise.all([
    getMyHandymanProfile(),
    getServiceById(id).catch(() => null),
  ]);
  if (!profile) redirect("/auth/serviceselection");
  // Owner-only: handymen may edit just their own listings.
  if (!service || service.handyman_id !== profile._id) redirect("/dashboard/services");

  return (
    <ServiceCreateForm
      serviceId={service._id ?? id}
      handymanId={profile._id}
      initial={{
        category: service.category ?? "",
        subCategory: service.subCategory ?? "",
        description: service.description ?? "",
        price: service.price ?? 0,
        pricingModel: (service.pricingModel ?? "fixed") as "fixed" | "hourly" | "contract",
        dateISO: toDateTimeLocalValue(service.date),
        estimatedTime: service.schedule?.estimatedTime ?? "",
        estimatedDuration: service.schedule?.estimatedDuration ?? "",
        materialsIncluded: service.materials_included ?? false,
        existingImages: (service.image ?? [])
          .filter((img) => img?.url)
          .map((img) => ({ url: img.url as string, public_id: img.public_id ?? "" })),
      }}
    />
  );
}
