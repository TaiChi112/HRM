"use client";

import { signOutToLandingAction } from "../../app/dashboard/actions";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type UserProfile = {
  name: string | null;
  email: string | null;
  image: string | null;
};

type UserProfileDropdownProps = {
  user: UserProfile;
};

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const displayName = user.name ?? "HR User";
  const firstName = displayName.split(" ")[0] ?? displayName;
  const displayEmail = user.email ?? "Signed in user";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="group flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition hover:border-gray-200 hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="h-9 w-9 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
            {avatarInitial}
          </div>
        )}

        <span className="hidden max-w-28 truncate text-sm font-medium text-gray-700 sm:inline">
          {firstName}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-gray-400 transition group-hover:text-gray-600 sm:block" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl shadow-slate-950/10"
        >
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="h-11 w-11 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {avatarInitial}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{displayEmail}</p>
            </div>
          </div>

          <div className="my-3 h-px bg-gray-200" />

          <form action={signOutToLandingAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}