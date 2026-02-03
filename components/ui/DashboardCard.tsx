"use client";

import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value?: string | number;
  description: string;
  icon: ReactNode;
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-3 md:w-xs">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 flex items-center gap-4">
        {value !== undefined ? (
          <div className="text-3xl font-bold">{value}</div>
        ) : null}
        <div className="flex-1 text-xs text-gray-400">{description}</div>
        {icon}
      </div>
    </div>
  );
}
