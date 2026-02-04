"use client";

import {
  Bike,
  Clock8,
  LifeBuoy,
  MousePointer2,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import brakeIcon from "@/public/brake-icon.svg";
import { useTranslations } from "next-intl";

type AlertCardProps = {
  severity: "warning" | "danger";
  pieceName: string;
  trailerLabel: string;
  distanceLabel: string;
  timeframe: string;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export default function AlertCard({
  severity,
  pieceName,
  trailerLabel,
  distanceLabel,
  timeframe,
  selectable = false,
  selected = false,
  onToggleSelect,
}: AlertCardProps) {
  const t = useTranslations("AlertCard");
  const iconStroke = 1.2;
  const isWarning = severity === "warning";
  const severityLabel = isWarning
    ? t("severity.warning")
    : t("severity.critical");
  const severityTagClass = isWarning ? "p-tag-warning" : "p-tag-danger";
  const title = isWarning ? t("title.warning") : t("title.critical");
  const description = isWarning
    ? t("description.warning", { piece: pieceName, percent: 90 })
    : t("description.critical", { piece: pieceName, percent: 100 });
  const secondaryBg = isWarning ? "bg-orange-100" : "bg-red-100";
  const secondaryIconColor = isWarning ? "text-orange-600" : "text-red-600";
  const SecondaryIcon = isWarning ? LifeBuoy : null;

  return (
    <div
      className={`relative rounded-xl border p-3 pr-12 md:w-xs ${
        selected ? "border-black" : "border-gray-200"
      }`}
      onClick={selectable ? onToggleSelect : undefined}
      role={selectable ? "button" : undefined}
      aria-pressed={selectable ? selected : undefined}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <TriangleAlert
          className="h-8 w-8 text-red-600"
          strokeWidth={iconStroke}
        />
        <span className={`rounded-md p-1 ${secondaryBg}`}>
          {SecondaryIcon ? (
            <SecondaryIcon
              className={`h-8 w-8 ${secondaryIconColor}`}
              strokeWidth={iconStroke}
            />
          ) : (
            <Image
              src={brakeIcon}
              alt={""}
              width={34}
              height={22}
              className="h-8 w-8"
            />
          )}
        </span>
      </div>
      <div className="flex gap-2 mb-4">
        {title}
        <span className={`p-tag ${severityTagClass}`}>{severityLabel}</span>
      </div>
      <div className="text-gray-400">{description}</div>
      <div className="flex gap-2 mt-2 text-gray-400">
        <Bike className="h-5 w-5 text-green-600" strokeWidth={iconStroke} />
        {trailerLabel}
      </div>
      <div className="flex gap-2 text-gray-400">
        <MousePointer2
          className="h-5 w-5 -scale-x-100"
          strokeWidth={iconStroke}
        />
        {distanceLabel}
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-gray-400">
        <Clock8 className="h-4 w-4" strokeWidth={iconStroke} />
        {timeframe}
      </div>
    </div>
  );
}
