"use client";

import type { LucideIcon } from "lucide-react";

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
};

export function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
