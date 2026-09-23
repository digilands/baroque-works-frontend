"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import TextInput from "../../ui/TextInput";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { nigerianStates } from "@/utils/data";
import AvatarUpload from "@/components/ui/AvatarUpload";
import LocationPicker, { type PickedLocation } from "@/components/ui/LocationPicker";
import StyledSelect from "@/components/ui/StyledSelect";
import { useCreateHandyman, useUpdateMe, useOnboardingCategories } from "@/hooks/useOnboarding";
import { useUser } from "@/hooks/useAuth";
import type { UploadedFile } from "@/lib/api";
import type { ExperienceLevel } from "@/lib/api";
import { loadDraft, saveDraft, clearDraft, type OnboardingDraft } from "../serviceselection/page";

const EXPERIENCE_OPTIONS: ExperienceLevel[] = ["beginner", "intermediate", "expert"];

interface CategoryExperience {
  id: string;
  name: string;
  experienceLevel: ExperienceLevel | "";
}

interface ProfileSetupValues {
  name: string;
  bio: string;
  address: string;
}

function readDraft() {
  const draft = loadDraft();
  return {
    categoryIds: draft.categoryIds,
    experiences: draft.experiences,
    avatar: (draft.avatar as UploadedFile | null) ?? null,
    picked: (draft.picked as PickedLocation | null) ?? null,
    stateName: draft.stateName ?? "Lagos",
    lga: draft.lga ?? "",
    name: draft.name ?? "",
    bio: draft.bio ?? "",
    address: draft.address ?? "",
  };
}

/** Debounced auto-persists Formik field values to the onboarding draft. */
function AutoPersist({ onPersist }: { onPersist: (patch: Partial<OnboardingDraft>) => void }) {
  const { values } = useFormikContext<ProfileSetupValues>();
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onPersist({ name: values.name, bio: values.bio, address: values.address });
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [values.name, values.bio, values.address, onPersist]);

  return null;
}

export default function SetupProfile() {
  const router = useRouter();
  const { data: sessionUser } = useUser();
  const { data: apiCategories = [] } = useOnboardingCategories();
  const createHandyman = useCreateHandyman();
  const updateMe = useUpdateMe();

  const [draftData, setDraftData] = useState(() => ({
    categoryIds: [] as string[],
    experiences: {} as Record<string, string>,
    avatar: null as UploadedFile | null,
    picked: null as PickedLocation | null,
    stateName: "Lagos",
    lga: "",
    name: "",
    bio: "",
    address: "",
  }));
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Record<string, string>>({});
  const [avatar, setAvatar] = useState<UploadedFile | null>(null);
  const [picked, setPicked] = useState<PickedLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [stateName, setStateName] = useState("Lagos");
  const [lga, setLga] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loaded = readDraft();
    // sessionStorage is intentionally read after hydration to keep the server
    // and client render trees identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftData(loaded);
    setCategoryIds(loaded.categoryIds);
    setExperiences(loaded.experiences);
    setAvatar(loaded.avatar);
    setPicked(loaded.picked);
    setStateName(loaded.stateName);
    setLga(loaded.lga);
    setDraftLoaded(true);
  }, []);

  const categoryNameMap = useMemo(() => {
    if (apiCategories.length === 0) return {};
    return Object.fromEntries(apiCategories.map((c) => [c._id, c.displayName]));
  }, [apiCategories]);

  const categoryExps: CategoryExperience[] = useMemo(
    () =>
      categoryIds.map((id) => ({
        id,
        name: categoryNameMap[id] ?? id,
        experienceLevel: (experiences[id] ?? "") as ExperienceLevel | "",
      })),
    [categoryIds, experiences, categoryNameMap],
  );

  useEffect(() => {
    if (draftLoaded && categoryIds.length === 0) router.replace("/auth/serviceselection");
  }, [categoryIds.length, draftLoaded, router]);

  useEffect(() => {
    if (draftLoaded && apiCategories.length > 0 && categoryExps.length === 0) {
      router.replace("/auth/serviceselection");
    }
  }, [apiCategories.length, categoryExps.length, draftLoaded, router]);

  const persistDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    saveDraft(patch);
  }, []);

  const handleCategoryExperienceChange = (id: string, level: string) => {
    setExperiences((prev) => {
      const next = { ...prev, [id]: level };
      persistDraft({ experiences: next });
      return next;
    });
  };

  const handleAvatarUploaded = (file: UploadedFile) => {
    setAvatar(file);
    persistDraft({ avatar: { publicId: file.publicId, url: file.url, secureUrl: file.secureUrl } });
  };

  const handleLocationConfirm = (loc: PickedLocation) => {
    setPicked(loc);
    setShowMap(false);
    persistDraft({ picked: { latitude: loc.latitude, longitude: loc.longitude, label: loc.label } });
  };

  const handleStateChange = (value: string) => {
    setStateName(value);
    persistDraft({ stateName: value });
  };

  const handleLgaChange = (value: string) => {
    setLga(value);
    persistDraft({ lga: value });
  };

  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Full name is required").max(80, "Full name must be 80 characters or fewer"),
    bio: Yup.string().max(500, "Bio must be 500 characters or fewer"),
    address: Yup.string().max(160, "Address must be 160 characters or fewer"),
  });

  const handleSubmit = async (values: ProfileSetupValues) => {
    setFormError("");
    const missingExp = categoryExps.find((c) => !c.experienceLevel);
    if (missingExp) {
      setFormError(`Please select an experience level for "${missingExp.name}".`);
      return;
    }
    try {
      await createHandyman.mutateAsync({
        categoryId: categoryExps.map((c) => ({
          type: c.id,
          experienceLevel: c.experienceLevel as ExperienceLevel,
        })),
        ...(picked
          ? {
              location: {
                coordinates: [picked.longitude, picked.latitude] as [number, number],
                state: stateName,
                ...(lga.trim() ? { lga: lga.trim() } : {}),
              },
            }
          : {}),
      });
      const imageUrl = avatar?.secureUrl || avatar?.url;
      const profileImage =
        avatar?.publicId && imageUrl
          ? [{ url: imageUrl, public_id: avatar.publicId }]
          : undefined;
      const profileUpdate = {
        ...(sessionUser?.email ? { email: sessionUser.email } : {}),
        ...(values.name.trim() ? { fullname: values.name.trim() } : {}),
        ...(values.bio.trim() ? { bio: values.bio.trim() } : {}),
        ...(values.address.trim() ? { address: values.address.trim() } : {}),
        ...(profileImage ? { image: profileImage } : {}),
      };
      if (Object.keys(profileUpdate).length > 0) {
        await updateMe.mutateAsync(profileUpdate);
      }
      clearDraft();
      router.push("/auth/additional-info");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Setup failed. Please try again.");
    }
  };

  if (!draftLoaded || categoryIds.length === 0) return null;

  const isBusy = createHandyman.isPending || updateMe.isPending;
  const mutationError = createHandyman.error ?? updateMe.error;

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-12 px-6">
      <div className="max-w-2xl w-full text-center mb-10">
        <Title>Setup profile</Title>
        <SubTitle>Provide details that will help clients find and trust you.</SubTitle>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <AvatarUpload
            folder="user-profiles"
            initialUrl={avatar?.secureUrl || avatar?.url}
            onUploaded={handleAvatarUploaded}
          />
        </div>

        {(formError || mutationError) && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
            {formError || mutationError?.message}
          </div>
        )}

        <Formik
          initialValues={{
            name: sessionUser?.fullname || draftData.name || "",
            bio: draftData.bio || "",
            address: draftData.address || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <AutoPersist onPersist={persistDraft} />

              <div className="space-y-4">
                <TextInput label="Full Name" name="name" required maxLength={80} placeholder="e.g. Emeka John" />

                {/* Per-category experience levels */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Experience per category
                  </p>
                  {categoryExps.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3"
                    >
                      <span className="text-sm font-bold text-gray-700 shrink min-w-0 truncate">
                        {cat.name}
                      </span>
                      <StyledSelect
                        value={cat.experienceLevel}
                        onChange={(v) => handleCategoryExperienceChange(cat.id, v)}
                        options={EXPERIENCE_OPTIONS.map((lvl) => ({
                          value: lvl,
                          label: lvl.charAt(0).toUpperCase() + lvl.slice(1),
                        }))}
                        placeholder="Level"
                        aria-label={`Experience level for ${cat.name}`}
                        className="ml-auto shrink-0"
                        triggerClassName="w-auto min-w-[7rem] px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                      />
                    </div>
                  ))}
                </div>

                <TextInput label="Bio / Description" name="bio" multiline rows={4} maxLength={500} placeholder="Tell clients about your experience and skills..." />
                <TextInput label="Service Address" name="address" maxLength={160} placeholder="e.g. No 12, Wuse Str, Abuja" />

                {/* Location */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">Work location</p>
                  {!showMap ? (
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-gray-900 transition-all"
                    >
                      {picked ? `${picked.label.slice(0, 48)} — change` : "Pin your location on the map"}
                    </button>
                  ) : (
                    <LocationPicker
                      initial={picked}
                      onConfirm={handleLocationConfirm}
                      onCancel={() => setShowMap(false)}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">State</span>
                      <div className="mt-1 w-full">
                        <StyledSelect
                          value={stateName}
                          onChange={handleStateChange}
                          options={nigerianStates.map((s) => ({ value: s, label: s }))}
                          aria-label="State"
                          className="w-full"
                          triggerClassName="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">LGA</span>
                      <input
                        value={lga}
                        onChange={(e) => handleLgaChange(e.target.value)}
                        placeholder="e.g. Ikeja"
                        className="mt-1 w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none placeholder:text-gray-300"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isBusy}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-100 disabled:opacity-50 group"
                >
                  {isBusy || isSubmitting ? "Saving..." : "Complete Setup"}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
