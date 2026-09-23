"use client";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/AuthContext";

/**
 * Profile-page logout. Lives here (not the sidebar) per design —
 * the sidebar footer only links to the profile.
 */
export default function LogoutButton({ className = "" }: { className?: string }) {
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
    } catch {
      // logout mutation already redirects on success; ignore failures here
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60 ${className}`}
    >
      <HugeiconsIcon icon={Logout01Icon} size={18} />
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}
