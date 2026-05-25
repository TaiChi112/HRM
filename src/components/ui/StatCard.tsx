"use client";

import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:border-blue-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className={`${color} rounded-lg p-3 text-white`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="mb-1 text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </button>
  );
}
