import type {
  ApiHandyman,
  ApiHirer,
  ApiJob,
  ApiUser,
  ProfessionSubCategory,
  ServiceCategory,
  ServiceFeedItem,
} from "./queries";
import type { Client, Financials, JobLocation } from "@/types/job";

/** "₦17,700" */
export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

/** "Oct 24, 2025" — falls back to the raw value when unparseable. */
export function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Initials avatar fallback, e.g. "Sarah Johnson" -> "SJ". */
export function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

/** ISO datetime -> `datetime-local` input value ("YYYY-MM-DDTHH:mm"). */
export function toDateTimeLocalValue(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export interface CarouselItem {
  name: string;
  image: string;
  sections: string[];
  category: string;
}

/** Backend category -> home carousel item. */
export function mapCategoryToCarouselItem(
  category: ServiceCategory,
  subcategories: ProfessionSubCategory[] = [],
): CarouselItem {
  return {
    name: category.displayName ?? "Services",
    image: category.image?.url ?? "",
    sections: [
      "All",
      ...subcategories.map((s) => s.displayName ?? "").filter(Boolean),
    ],
    category: category._id ?? category.code ?? "",
  };
}

export interface ServiceCardData {
  id: string;
  image: string;
  title: string;
  rate: string;
  rateType: string;
  profile: {
    profilePic: string;
    name: string;
    availability: boolean;
    rating: number;
  };
}

/** GET /services feed item -> services grid card. */
export function mapServiceItemToCard(item: ServiceFeedItem): ServiceCardData {
  const handyman = item.handyman;
  return {
    id: item._id ?? "",
    image: handyman?.image?.[0]?.url ?? "",
    title: item.description ?? "Service",
    rate: formatNaira(item.price ?? 0),
    rateType: item.pricingModel ?? "fixed",
    profile: {
      profilePic: handyman?.image?.[0]?.url ?? "",
      name: handyman?.fullname ?? "Handyman",
      availability: true,
      rating: handyman?.rating ?? 0,
    },
  };
}

export interface JobListItem {
  id: string;
  title: string;
  status: string;
  category: string;
  urgency: string;
  budget: string;
  date: string;
  distance: string;
}

/** Backend job -> dashboard jobs list row. */
export function mapJobToListItem(job: ApiJob, categoryName?: string): JobListItem {
  const distanceMeters = job.distance ?? 0;
  return {
    id: job._id ?? "",
    title: job.title ?? "Untitled job",
    status: (job.status ?? "OPEN").toLowerCase(),
    category: categoryName ?? (job.category && !/^[\da-f]{24}$/i.test(job.category) ? job.category : "Service request"),
    urgency: job.urgency ?? "NORMAL",
    budget: formatNaira(job.budget?.max ?? job.budget?.min ?? 0),
    date: formatDate(job.createdAt),
    distance:
      distanceMeters > 0 ? `${(distanceMeters / 1000).toFixed(1)}km away` : "",
  };
}

/** Hirer + user chain -> job detail client card. */
export function mapHirerToClient(hirer: ApiHirer, user: ApiUser): Client {
  const jobsPosted = hirer.hiringStats?.jobsPosted ?? 0;
  const avatar = user.image?.[0]?.url;
  return {
    id: hirer._id ?? "",
    name: user.fullname ?? hirer.organizationName ?? "Client",
    avatarUrl: avatar && avatar.length > 0 ? avatar : initials(user.fullname),
    rating: user.rating ?? 0,
    totalJobs: jobsPosted,
    isVerified: hirer.trustSignals?.isPaymentVerified ?? false,
    isRepeatClient: jobsPosted > 1,
    memberSince: formatDate(hirer.createdAt),
  };
}

/** Backend job -> job detail schedule/payment + location blocks. */
export function mapJobToDetailBlocks(job: ApiJob): {
  location: JobLocation;
  financials: Financials;
  requestedDate: string;
} {
  const coords = job.location?.coordinates;
  const distanceMeters = job.distance ?? 0;
  return {
    location: {
      address:
        coords && coords.length === 2
          ? `${coords[1]?.toFixed(4)}, ${coords[0]?.toFixed(4)}`
          : "Location shared after acceptance",
      city: "",
      state: "Nigeria",
      coordinates: {
        lat: coords?.[1] ?? 0,
        lng: coords?.[0] ?? 0,
      },
      distance:
        distanceMeters > 0
          ? `${(distanceMeters / 1000).toFixed(1)}km`
          : "nearby",
    },
    financials: {
      subtotal: job.budget?.min ?? 0,
      serviceFee: 0,
      tax: 0,
      total: job.budget?.max ?? job.budget?.min ?? 0,
      paymentStatus: "pending",
    },
    requestedDate: formatDate(job.createdAt),
  };
}

export interface ProCardData {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  experience: string;
  distance: string;
  jobsCompleted: number;
  locationLabel: string;
  hasCoords: boolean;
}

/** Backend handyman -> search pros card. */
export function mapHandymanToProCard(handyman: ApiHandyman): ProCardData {
  const coords = handyman.location?.coordinates;
  const distanceMeters = handyman.distance ?? 0;
  const experienceLevel = handyman.categoryId?.[0]?.experienceLevel;
  return {
    id: handyman._id ?? "",
    name: handyman.user?.fullname ?? "Handyman",
    avatar: handyman.user?.image?.[0]?.url ?? "",
    rating: handyman.rating ?? 0,
    experience: experienceLevel
      ? `${experienceLevel[0]?.toUpperCase()}${experienceLevel.slice(1)}`
      : "Professional",
    distance:
      distanceMeters > 0 ? `${(distanceMeters / 1000).toFixed(1)}km` : "",
    jobsCompleted: handyman.jobsCompleted ?? 0,
    locationLabel: [handyman.location?.lga, handyman.location?.state]
      .filter(Boolean)
      .join(", "),
    hasCoords: Array.isArray(coords) && coords.length === 2,
  };
}
