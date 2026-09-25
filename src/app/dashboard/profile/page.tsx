import ProfileEditForm, { type ProfileEditInitial } from "@/app/ui/profile/ProfileEditForm";
import PasswordChangeForm from "@/app/ui/profile/PasswordChangeForm";
import LogoutButton from "@/components/ui/LogoutButton";
import {
  getMyHandymanProfile,
} from "@/lib/server/queries";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireSessionUser("/dashboard/profile");

  const handyman =
    user.role === "handyman" ? await getMyHandymanProfile() : null;

  const initial: ProfileEditInitial = {
    role: user.role ?? "",
    fullname: user.fullname ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    bio: user.bio ?? "",
    address: user.address ?? "",
    imageUrl: user.image?.[0]?.url ?? "",
    state: user.location?.state ?? handyman?.location?.state ?? "",
    lga: user.location?.lga ?? handyman?.location?.lga ?? "",
    availability:
      handyman?.availability?.status === "unavailable" ? "unavailable" : "available",
  };

  return (
    <>
      <ProfileEditForm initial={initial} />
      <PasswordChangeForm />
      <div className="mt-8">
        <LogoutButton />
      </div>
    </>
  );
}
