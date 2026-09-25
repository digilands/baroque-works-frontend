import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import {
  PASSWORD_CRITERIA_LABELS,
  evaluatePassword,
} from "@/lib/password";
import { cn } from "@/utils/cn";

interface PasswordChecklistProps {
  /** Current password input value — re-evaluated on every render (onChange-driven). */
  password: string;
  className?: string;
  /** ID for aria-describedby wiring from the password input. */
  id?: string;
}

/**
 * Real-time password validation checklist. Renders directly beneath a
 * password input; each rule flips from muted gray to emerald with a smooth
 * transition as the user types. Pure function of `password` — no local
 * state, so it stays server-component compatible.
 */
export default function PasswordChecklist({
  password,
  className,
  id,
}: PasswordChecklistProps) {
  const criteria = evaluatePassword(password);

  return (
    <ul
      id={id}
      aria-live="polite"
      aria-label="Password requirements"
      className={cn("space-y-1 pt-0.5", className)}
    >
      {PASSWORD_CRITERIA_LABELS.map(({ key, label }) => {
        const met = criteria[key];
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-2 text-xs font-medium transition-all duration-200 ease-in-out",
              met ? "text-emerald-600" : "text-gray-500",
            )}
          >
            {met ? (
              <span
                aria-hidden="true"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-all duration-200 ease-in-out"
              >
                <HugeiconsIcon icon={Tick02Icon} size={10} strokeWidth={3} />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300 transition-all duration-200 ease-in-out"
              />
            )}
            <span>{label}</span>
            <span className="sr-only">{met ? "met" : "not met"}</span>
          </li>
        );
      })}
    </ul>
  );
}
