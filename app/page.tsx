"use client";

import { Bike, CircleAlert, MoveRight, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Divider } from "primereact/divider";
import DashboardCard from "@/components/ui/DashboardCard";
import { useAlerts, useTrailers } from "@/lib/api";
import { determineStatus } from "@/utils";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";

export default function Home() {
  const t = useTranslations("HomePage");
  const { trailers: vehicles, loading } = useTrailers();
  const { alerts, loading: alertsLoading } = useAlerts();
  const activeVehiclesCount = vehicles.filter(
    (vehicle) => determineStatus(vehicle) === "On Mission",
  ).length;
  const averageDowntime =
    vehicles.length > 0
      ? vehicles.reduce((sum, vehicle) => sum + (vehicle.average_downtime ?? 0), 0) /
        vehicles.length
      : null;
  const technicalAvailability =
    averageDowntime === null ? null : Math.max(0, 24 - averageDowntime);
  const [averageKmPerDay, setAverageKmPerDay] = useState<string>("—");
  const [averageKmLoading, setAverageKmLoading] = useState(false);

  useEffect(() => {
    const fetchAverageKm = async () => {
      try {
        setAverageKmLoading(true);
        const data = await apiClient.get<{
          success: boolean;
          data?: {
            average_km_per_vehicle_per_day?: number;
          };
        }>("/api/dashboard/average-km-per-day");
        const value = data?.data?.average_km_per_vehicle_per_day ?? null;
        setAverageKmPerDay(typeof value === "number" ? `${value}km` : "—");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setAverageKmPerDay("—");
      } finally {
        setAverageKmLoading(false);
      }
    };

    fetchAverageKm();
  }, []);


  return (
    <div className="p-6">
      <div className="text-2xl font-semibold">{t("title")}</div>
      <div className="text-gray-400">{t("overview")}</div>
      <div className="flex flex-col gap-4 py-8 md:flex-row md:flex-wrap">
        <DashboardCard
          title={t("cards.totalVehicles.title")}
          value={loading ? "—" : vehicles.length}
          description={
            loading
              ? t("cards.totalVehicles.loading")
              : t("cards.totalVehicles.description", {
                  active: activeVehiclesCount,
                  total: vehicles.length,
                })
          }
          icon={<Bike className="h-5 w-5 text-green-600" />}
        />
        <DashboardCard
          title={t("cards.alerts.title")}
          value={alertsLoading ? "—" : alerts.length}
          description={t("cards.alerts.description")}
          icon={<TriangleAlert className="h-5 w-5 text-red-600" />}
        />
      </div>
      <div className="flex justify-between">
        <div className="uppercase font-bold">{t("sections.stats")}</div>
        <div className="flex items-end gap-2 text-sm">
          <Link href={"/"}>{t("seeAll")}</Link> <MoveRight />
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <DashboardCard
          title={t("cards.mileage.title")}
          value={averageKmLoading ? "—" : averageKmPerDay}
          description={t("cards.mileage.description")}
          icon={<Bike className="h-5 w-5 text-green-600" />}
        />
        <DashboardCard
          title={t("cards.availability.title")}
          value={
            loading || technicalAvailability === null
              ? "—"
              : `${technicalAvailability.toFixed(1)}h`
          }
          description={t("cards.availability.description")}
          icon={<Bike className="h-5 w-5 text-green-600" />}
        />
      </div>
      <div className="flex justify-between pt-8">
        <div className="uppercase font-bold">{t("sections.alerts")}</div>
        <div className="flex items-end gap-2 text-sm">
          <Link href={"/"}>{t("seeAll")}</Link> <MoveRight />
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        {alertsLoading ? (
          <DashboardCard
            title={t("alerts.loadingTitle")}
            description={t("alerts.loadingDescription")}
            icon={<TriangleAlert className="h-5 w-5 text-gray-400" />}
          />
        ) : alerts.length === 0 ? (
          <DashboardCard
            title={t("alerts.emptyTitle")}
            description={t("alerts.emptyDescription")}
            icon={<TriangleAlert className="h-5 w-5 text-gray-400" />}
          />
        ) : (
          alerts.slice(0, 6).map((alert) => {
            const isWarning = alert.status === "warning";
            const title = isWarning
              ? t("alerts.warningTitle")
              : t("alerts.criticalTitle");
            const description = isWarning
              ? t("alerts.warningDescription", { piece: alert.piece_name })
              : t("alerts.criticalDescription", { piece: alert.piece_name });
            const iconColor = isWarning ? "text-orange-600" : "text-red-600";
            const Icon = isWarning ? CircleAlert : TriangleAlert;

            return (
              <DashboardCard
                key={alert.id}
                title={title}
                description={description}
                icon={<Icon className={`h-5 w-5 ${iconColor}`} />}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
