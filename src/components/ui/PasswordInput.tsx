"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/utils/cn";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Used in the toggle's accessible name (defaults to "password"). */
  toggleLabel?: string;
}

/**
 * Password field with a show/hide eye toggle. Drop-in replacement for a
 * raw `<input type="password">` — parent stays fully controlled via the
 * usual value/onChange/onBlur props. Right padding for the toggle is
 * enforced so text never slides under the icon.
 */
export default function PasswordInput({
  className,
  toggleLabel = "password",
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...rest}
        type={visible ? "text" : "password"}
        className={cn(className, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? `Hide ${toggleLabel}` : `Show ${toggleLabel}`}
        aria-pressed={visible}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
      >
        <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} size={20} />
      </button>
    </div>
  );
}
