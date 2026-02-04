"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Map as MapIcon, Zap, Battery, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { useTrailerDetails } from "@/lib/api";
import { reverseGeocode } from "@/lib/geocoding";
import {
  determineStatus,
  sortAlerts,
  sortIncidents,
  getBatteryTextColor,
  getBatteryHexColor,
  getStatusStyle,
  formatDate,
  calculateAge,
} from "@/utils";
import AlertList from "@/components/AlertList";
import IncidentList from "@/components/IncidentList";

const TrailerMap = dynamic(() => import("@/components/TrailerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
      Chargement de la carte...
    </div>
  ),
});

export default function TrailerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("TrailerDetail");
  const trailerId = params.id as string;

  const { data, loading } = useTrailerDetails(trailerId);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!data?.trailer) return;
    reverseGeocode(data.trailer.actual_pos_lat, data.trailer.actual_pos_long)
      .then(setAddress);
  }, [data?.trailer]);

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-lg">{t("loading")}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{t("notFound")}</p>
      </main>
    );
  }

  const { trailer, alerts, performance, recent_incidents } = data;
  const status = determineStatus(trailer);
  const vehicleAge = calculateAge(trailer.purchased_date);

  const sortedAlerts = sortAlerts(alerts);
  const sortedIncidents = sortIncidents(recent_incidents);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Available": return t("statusAvailable");
      case "On Mission": return t("statusOnMission");
      case "Charging": return t("statusCharging");
      case "Maintenance": return t("statusMaintenance");
      default: return status;
    }
  };

  const getAlertLabel = (status: string) => {
    switch (status) {
      case "critic": return t("alertCritic");
      case "warning": return t("alertWarning");
      case "solved": return t("alertSolved");
      default: return status;
    }
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{trailer.serial_number}</h1>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={getStatusStyle(status)}
                >
                  {getStatusLabel(status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <MapPin size={16} />
                {address || "Chargement..."}
              </p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
          {/* Colonne gauche */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Carte */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">{t("location")}</h2>
              <div className="h-[271px] rounded-lg overflow-hidden">
                <TrailerMap
                  lat={parseFloat(trailer.actual_pos_lat)}
                  lng={parseFloat(trailer.actual_pos_long)}
                  status={status}
                />
              </div>
            </div>

            {/* Stats journalières */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">{t("dailyStats")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapIcon size={32} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{trailer.daily_km_traveled} km</p>
                  <p className="text-sm text-gray-500">{t("dailyKm")}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Zap size={32} className="text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{trailer.daily_energy_consumption} kWh</p>
                  <p className="text-sm text-gray-500">{t("dailyEnergy")}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Battery size={32} color={getBatteryHexColor(trailer.battery_level || 0)} className="mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${getBatteryTextColor(trailer.battery_level || 0)}`}>
                    {(trailer.battery_level || 0).toFixed(0)  }%
                  </p>
                  <p className="text-sm text-gray-500">{t("battery")}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock size={32} className="text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{trailer.downtime}h</p>
                  <p className="text-sm text-gray-500">{t("downtime")}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("autonomy")}</span>
                  <span>{trailer.daily_km_traveled}/{trailer.autonomy} km</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((trailer.daily_km_traveled / trailer.autonomy) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bilan d'exploitation */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">{t("totals")}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{trailer.total_km_traveled.toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-500">{t("totalKm")}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{trailer.total_delivery_count}</p>
                  <p className="text-xs text-gray-500">{t("totalDeliveries")}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">{trailer.total_energy_consumption.toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-500">{t("totalEnergy")}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-600">{trailer.yearly_maintenance_cost.toLocaleString("fr-FR")}€</p>
                  <p className="text-xs text-gray-500">{t("maintenanceCost")}</p>
                </div>
              </div>
            </div>

            {/* Historique des trajets */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">{t("recentTrips")}</h2>
              {performance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">{t("date")}</th>
                        <th className="text-right py-2 px-3">{t("distance")}</th>
                        <th className="text-right py-2 px-3">{t("energy")}</th>
                        <th className="text-right py-2 px-3">{t("deliveries")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.map((perf, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-3">{formatDate(perf.date)}</td>
                          <td className="text-right py-3 px-3">{perf.distance} km</td>
                          <td className="text-right py-3 px-3">{perf.energy} kWh</td>
                          <td className="text-right py-3 px-3">
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                              {perf.deliveries}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">{t("noTrips")}</p>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-6">
            {/* Alertes */}
            <AlertList
              alerts={sortedAlerts}
              title={t("alerts")}
              noAlertsText={t("noAlerts")}
              getAlertLabel={getAlertLabel}
            />

            {/* Incidents */}
            <IncidentList
              incidents={sortedIncidents}
              title={t("incidents")}
              noIncidentsText={t("noIncidents")}
              severityLabel={t("severity")}
            />

            {/* Infos véhicule */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">{t("vehicleInfo")}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t("purchaseDate")}</span>
                  <span className="font-medium">{formatDate(trailer.purchased_date)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t("vehicleAge")}</span>
                  <span className="font-medium">{vehicleAge} {t("years")}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t("autonomyMax")}</span>
                  <span className="font-medium">{trailer.autonomy} km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t("consumption100km")}</span>
                  <span className="font-medium">{trailer.energy_consumption_per_100_km} kWh</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t("availability")}</span>
                  <span className="font-medium">{trailer.technical_disponibility}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t("avgDowntime")}</span>
                  <span className="font-medium">{trailer.average_downtime}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}