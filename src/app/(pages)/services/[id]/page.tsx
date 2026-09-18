import { redirect } from "next/navigation";
import ServiceDetailView from "@/app/ui/ServiceDetailView";
import { ServiceNotFound } from "./not-found";
import {
  getCategories,
  getHandymanById,
  getServiceById,
  getServicesFeed,
  isAuthError,
} from "@/lib/server/queries";
import { formatNaira } from "@/lib/server/mappers";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=BaroqueWorks";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Service reads require a session: guests are sent to login (with a
  // return address), unknown IDs render the inline not-found UI.
  const service = await getServiceById(id).catch((error: unknown) => {
    if (isAuthError(error)) redirect(`/auth/login?next=/services/${id}`);
    return null;
  });
  if (!service || !service.handyman_id) return <ServiceNotFound />;

  const [handyman, feed, categories] = await Promise.all([
    getHandymanById(service.handyman_id).catch(() => null),
    getServicesFeed({ handymanId: service.handyman_id, limit: 10 }),
    getCategories(),
  ]);
  if (!handyman) return <ServiceNotFound />;

  const categoryName =
    categories.find((c) => (c._id ?? c.code) === service.category)
      ?.displayName ?? "General";

  const user = handyman.user;
  const avatar = user?.image?.[0]?.url ?? FALLBACK_IMAGE;
  const galleryImages = (service.image ?? [])
    .map((img) => img?.url ?? "")
    .filter(Boolean);
  if (galleryImages.length === 0) galleryImages.push(avatar);

  const location = [handyman.location?.lga, handyman.location?.state]
    .filter(Boolean)
    .join(", ");

  const experienceLevel = handyman.categoryId?.[0]?.experienceLevel;
  const experience = experienceLevel
    ? `${experienceLevel[0]?.toUpperCase()}${experienceLevel.slice(1)} handyman`
    : "Experienced professional";

  return (
    <ServiceDetailView
      serviceId={service._id ?? id}
      handymanId={service.handyman_id}
      galleryImages={galleryImages}
      profilePic={avatar}
      name={user?.fullname ?? "Handyman"}
      rating={handyman.rating ?? 0}
      reviews={handyman.jobsCompleted ?? 0}
      aboutMe="No description provided."
      experience={experience}
      categoryName={categoryName}
      location={location || "Nigeria"}
      offeredServices={feed.items.map((item) => ({
        id: item._id ?? service._id ?? id,
        name: (item.description ?? "Service").slice(0, 42),
        image: galleryImages[0] ?? FALLBACK_IMAGE,
        rate: formatNaira(item.price ?? service.price ?? 0),
        rateType: item.pricingModel ?? service.pricingModel ?? "fixed",
      }))}
    />
  );
}
