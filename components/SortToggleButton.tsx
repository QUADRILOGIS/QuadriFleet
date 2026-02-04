"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type SortToggleButtonProps = {
  order: "asc" | "desc";
  onToggle: () => void;
};

export default function SortToggleButton({
  order,
  onToggle,
}: SortToggleButtonProps) {
  const t = useTranslations("SortToggleButton");
  const leftLabel = order === "desc" ? t("more") : t("less");
  const rightLabel = order === "desc" ? t("less") : t("more");

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-gray-400 px-1.5 py-0.5 text-[9px] text-gray-600"
      onClick={onToggle}
    >
      <span className={`flex items-center justify-center gap-1`}>
        {leftLabel} <ArrowRight size={12} />
        {rightLabel} {t("recent")}
      </span>
    </button>
  );
}
