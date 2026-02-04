"use client";

import AlertCard from "@/components/AlertCard";
import { Button } from "primereact/button";
import { useState } from "react";
import { useAlerts, useTrailers } from "@/lib/api";
import { apiClient } from "@/lib/api/client";
import SortToggleButton from "@/components/SortToggleButton";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("AlertsPage");
  const [activeTab, setActiveTab] = useState<"critic" | "warning" | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const { alerts, loading, refetch } = useAlerts(true);
  const { trailers: vehicles } = useTrailers();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  const filteredAlerts =
    activeTab === null
      ? alerts
      : alerts.filter((alert) => alert.status === activeTab);

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const aTime = new Date(a.alert_date).getTime();
    const bTime = new Date(b.alert_date).getTime();
    return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
  });

  const formatTimeframe = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffMs = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return t("timeframe.today");
    }

    return t("timeframe.daysAgo", { days: diffDays });
  };

  return (
    <div className="p-6">
      <div className="text-2xl font-semibold">{t("title")}</div>
      <div className="text-gray-400">
        {t("activeCount", { count: alerts.length })}
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setActiveTab(activeTab === "critic" ? null : "critic")
            }
            className="flex flex-col items-center cursor-pointer"
          >
            <span className="p-tag p-tag-danger text-[10px] px-1.5 py-0.5 inline-flex items-center justify-center">
              {t("tabs.critical")}
            </span>
            <span
              className={`mt-1 block h-0.5 w-full ${
                activeTab === "critic" ? "bg-gray-300" : "bg-transparent"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveTab(activeTab === "warning" ? null : "warning")
            }
            className="flex flex-col items-center cursor-pointer"
          >
            <span className="p-tag p-tag-warning text-[10px] px-1.5 py-0.5 inline-flex items-center justify-center">
              {t("tabs.warning")}
            </span>
            <span
              className={`mt-1 block h-0.5 w-full ${
                activeTab === "warning" ? "bg-gray-300" : "bg-transparent"
              }`}
            />
          </button>
        </div>
        <SortToggleButton
          order={sortOrder}
          onToggle={() =>
            setSortOrder((current) => (current === "desc" ? "asc" : "desc"))
          }
        />
      </div>
      {sortedAlerts.length === 0 ? null : (
        <div className="flex justify-end my-8">
          <Button
              label={
                selectMode && selectedIds.length === 0
                    ? t("actions.cancelAction")
                    : selectMode && selectedIds.length > 0
                        ? t("actions.resolveSelection")
                        : t("actions.resolveAlert")
              }
            className="text-white bg-black hover:bg-gray-700 border-none"
            severity="secondary"
            icon={
              selectMode && selectedIds.length === 0
                  ? "pi pi-times"
                  : selectMode && selectedIds.length > 0
                      ? "pi pi-check"
                      : "pi pi-check-circle"
            }
            size="small"
            iconPos="right"
            onClick={async () => {
              if (!selectMode) {
                setSelectMode(true);
                return;
              }

              if (selectedIds.length === 0) {
                setSelectMode(false);
                return;
              }

              try {
                await Promise.all(
                    selectedIds.map((id) =>
                        apiClient.patch(`/api/alerts/${id}/resolve`),
                    ),
                );
                setSelectedIds([]);
                setSelectMode(false);
                await refetch();
              } finally {
                // no-op
              }
            }}
          />
        </div>
      )}
      {loading ? (
        <div className="text-sm text-gray-400">{t("states.loading")}</div>
      ) : sortedAlerts.length === 0 ? (
        <div className="text-sm text-gray-400">{t("states.empty")}</div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {sortedAlerts.map((alert) => {
            const trailer = vehicles.find(
              (vehicle) => vehicle.id === alert.trailer_id,
            );
            const totalKm =
              trailer?.total_km_traveled !== undefined
                ? `${trailer.total_km_traveled} km`
                : "—";
            const isSelected = selectedIds.includes(alert.id);

            return (
              <AlertCard
                key={alert.id}
                severity={alert.status === "warning" ? "warning" : "danger"}
                pieceName={alert.piece_name}
                trailerLabel={`QU-${alert.trailer_id.toString().padStart(3, "0")}-IS`}
                distanceLabel={totalKm}
                timeframe={formatTimeframe(alert.alert_date)}
                selectable={selectMode}
                selected={isSelected}
                onToggleSelect={() =>
                  setSelectedIds((current) =>
                    current.includes(alert.id)
                      ? current.filter((id) => id !== alert.id)
                      : [...current, alert.id],
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
