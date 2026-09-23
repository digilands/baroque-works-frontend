"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/utils/cn";

export interface StyledSelectOption {
  value: string;
  label: React.ReactNode;
}

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: StyledSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * Custom dropdown styled like the Header location popover
 * (white rounded-2xl panel, px-4 py-2.5 rows). Keyboard: Enter/Space open,
 * Escape close, outside click close.
 */
export default function StyledSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  className,
  triggerClassName,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: StyledSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  const selected = options.find((o) => o.value === value);
  const display = selected ? selected.label : placeholder;
  const hasSelection = Boolean(selected);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-left cursor-pointer",
          "focus:outline-none focus:ring-4 focus:border-indigo-600 focus:ring-indigo-100/50 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !hasSelection && "text-gray-400",
          triggerClassName,
        )}
      >
        <span className="truncate min-w-0">{display}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className={cn(
            "text-gray-500 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-50 duration-150"
        >
          {options.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-gray-400">No options</li>
          )}
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    close(true);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors rounded-lg mx-0",
                    active
                      ? "font-bold text-indigo-600 bg-indigo-50"
                      : "font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
