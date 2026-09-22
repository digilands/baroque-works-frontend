import dynamicImport from "next/dynamic";
import HomeServicesGrid from "../../ui/HomeServicesGrid";
import HomeLocationInitializer from "../../ui/HomeLocationInitializer";
import {
  getCategories,
  getServicesFeed,
  getSubcategories,
} from "@/lib/server/queries";
import {
  mapCategoryToCarouselItem,
  mapServiceItemToCard,
} from "@/lib/server/mappers";

// keen-slider is a heavy client island — split it from the RSC payload
// (kept server-rendered so carousel content still paints on first load).
const ServicesCarousel = dynamicImport(() => import("../../ui/ServicesCarousel"));

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    lat?: string;
    lng?: string;
    radius?: string;
  }>;
}) {
  const { category, lat, lng, radius } = await searchParams;

  const latitude = toNumber(lat);
  const longitude = toNumber(lng);
  const geoActive =
    latitude !== undefined &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude !== undefined &&
    longitude >= -180 &&
    longitude <= 180;
  const searchRadius = toNumber(radius) ?? 10;

  const categories = await getCategories();
  const selected = category
    ? categories.find((c) => (c._id ?? c.code) === category)
    : undefined;
  const selectedId = selected ? (selected._id ?? selected.code ?? "") : "";

  const [subcategories, feed] = await Promise.all([
    selectedId ? getSubcategories(selectedId) : Promise.resolve([]),
    getServicesFeed({
      category: category ? selectedId || undefined : undefined,
      limit: 24,
      latitude: geoActive ? latitude : undefined,
      longitude: geoActive ? longitude : undefined,
      radius: geoActive ? searchRadius : undefined,
    }),
  ]);

  const carouselItems = categories.map((c) =>
    mapCategoryToCarouselItem(
      c,
      (c._id ?? c.code) === selectedId ? subcategories : [],
    ),
  );

  return (
    <div>
      <HomeLocationInitializer
        category={selectedId || undefined}
        radius={searchRadius}
        geoActive={geoActive}
      />
      <ServicesCarousel items={carouselItems} selectedCategory={selectedId} />
      <div className="mt-6">
        <HomeServicesGrid
          title={selected?.displayName ?? "Services"}
          subtitle={
            geoActive ? `Within ${searchRadius}km of your location` : undefined
          }
          cards={feed.items.map(mapServiceItemToCard)}
          authGated={feed.unauthorized}
          params={{
            category: category ? selectedId || undefined : undefined,
            latitude: geoActive ? latitude : undefined,
            longitude: geoActive ? longitude : undefined,
            radius: geoActive ? searchRadius : undefined,
            limit: 24,
          }}
          nearby={
            geoActive
              ? {
                  latitude: latitude!,
                  longitude: longitude!,
                  radius: searchRadius,
                  category: selectedId,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
