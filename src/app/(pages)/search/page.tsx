import SearchFilters from "../../ui/search/SearchFilters";
import SearchResults from "../../ui/search/SearchResults";
import {
  getCategories,
  getHandymen,
  getServicesFeed,
} from "@/lib/server/queries";
import {
  mapHandymanToProCard,
  mapServiceItemToCard,
} from "@/lib/server/mappers";
import type { MapPin } from "@/components/ui/MapboxMap";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    query?: string;
    category?: string;
    pricingModel?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    handymanId?: string;
    hireFor?: string;
    lat?: string;
    lng?: string;
    radius?: string;
  }>;
}) {
  const sp = await searchParams;
  const tab = sp.tab === "pros" ? "pros" : "services";
  const query = sp.query?.trim().toLowerCase() ?? "";

  const latitude = toNumber(sp.lat);
  const longitude = toNumber(sp.lng);
  const geoActive =
    latitude !== undefined &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude !== undefined &&
    longitude >= -180 &&
    longitude <= 180;
  const radius = toNumber(sp.radius) ?? 10;
  const rating = toNumber(sp.rating);

  const [categories, feed, pros] = await Promise.all([
    getCategories(),
    getServicesFeed({
      category: sp.category || undefined,
      pricingModel: sp.pricingModel || undefined,
      minPrice: toNumber(sp.minPrice),
      maxPrice: toNumber(sp.maxPrice),
      rating,
      handymanId: sp.handymanId || undefined,
      limit: 24,
      latitude: geoActive ? latitude : undefined,
      longitude: geoActive ? longitude : undefined,
      radius: geoActive ? radius : undefined,
    }),
    getHandymen({
      categoryId: sp.category || undefined,
      rating,
      limit: 24,
      latitude: geoActive ? latitude : undefined,
      longitude: geoActive ? longitude : undefined,
      radius: geoActive ? radius : undefined,
    }),
  ]);

  const proCards = pros.handymen
    .filter((handyman) => {
      if (!query) return true;
      const haystack = [handyman.user?.fullname, handyman.user?.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    })
    .map(mapHandymanToProCard);
  const serviceItems = feed.items.filter((item) => {
    if (!query) return true;
    return [item.description, item.handyman?.fullname]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  const pins: MapPin[] = pros.handymen
    .filter((h) => Array.isArray(h.location?.coordinates) && h.location.coordinates.length === 2)
    .map((h) => ({
      id: h._id ?? "",
      latitude: h.location!.coordinates![1]!,
      longitude: h.location!.coordinates![0]!,
      label: h.user?.fullname ?? "Handyman",
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">Search</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24">
            <SearchFilters
              categories={categories}
              initial={{
                tab,
                category: sp.category ?? "",
                pricingModel: sp.pricingModel ?? "",
                minPrice: sp.minPrice ?? "",
                maxPrice: sp.maxPrice ?? "",
                rating: sp.rating ?? "",
                radius: String(sp.radius ?? "10"),
              }}
              currentGeo={geoActive ? { lat: latitude!, lng: longitude! } : null}
            />
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <SearchResults
            tab={tab}
            serviceCards={serviceItems.map(mapServiceItemToCard)}
            pros={proCards}
            pins={pins}
            servicesUnauthorized={feed.unauthorized}
            hireFor={sp.hireFor || undefined}
            mapCenter={
              geoActive
                ? { latitude: latitude!, longitude: longitude! }
                : { latitude: 6.5244, longitude: 3.3792 }
            }
          />
        </div>
      </div>
    </div>
  );
}
