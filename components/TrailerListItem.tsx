import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTrailerAlertsCount } from "@/lib/api";
import { reverseGeocode } from "@/lib/geocoding";
import { 
  determineStatus, 
  calculateBatteryLevel, 
  getBatteryTextColor, 
  getBatteryIconColor,
  formatSerialNumber,
  formatDistance,
  getStatusSeverity,
} from "@/utils";
import { AlertButton } from "@/components/ui";
import type { ApiTrailer } from "@/types";

type TrailerListItemProps = {
  trailer: ApiTrailer;
};


export default function TrailerListItem({ trailer }: TrailerListItemProps) {
  const t = useTranslations("TrailerCard");
  const [address, setAddress] = useState<string>("");
  const { alertCount, incidentCount } = useTrailerAlertsCount(trailer.id);
  
  useEffect(() => {
    reverseGeocode(trailer.actual_pos_lat, trailer.actual_pos_long)
      .then(setAddress);
  }, [trailer.actual_pos_lat, trailer.actual_pos_long]);
  
  const status = determineStatus(trailer);
  const batteryRemaining = calculateBatteryLevel(trailer);
  const serial = formatSerialNumber(trailer.id);
  const mileage = formatDistance(trailer.total_km_traveled);
  
  //TODO en attendant les vraies données ou supprimé si pas besoin
  const weight = (trailer.id * 73) % 601;
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Available": return t('statusAvailable');
      case "On Mission": return t('statusOnMission');
      case "Charging": return t('statusCharging');
      case "Maintenance": return t('statusMaintenance');
      default: return status;
    }
  };

  return (
    <Link href={`/fleet/${trailer.id}`} className="block">
      <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base">{serial}</h3>
          <Tag value={getStatusLabel(status)} severity={getStatusSeverity(status)} className="text-xs" />
        </div>

        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="flex items-center gap-1.5">
            <i className={`pi pi-percentage ${getBatteryIconColor(batteryRemaining)} text-xs`} />
            <span className={`font-semibold ${getBatteryTextColor(batteryRemaining)}`}>{batteryRemaining.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="pi pi-box text-gray-400 text-xs" />
            <span className="text-gray-600 text-xs">{weight}/600 kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="pi pi-map text-blue-500 text-xs" />
            <span className="text-gray-500 text-xs">{trailer.daily_km_traveled}/{trailer.autonomy} km</span>
          </div>
        </div>

        <ProgressBar 
          value={batteryRemaining} 
          showValue={false}
          style={{ height: '8px' }}
          className="mb-3"
        />

        {/* Localisation */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <i className="pi pi-map-marker text-gray-400" />
          <span className="truncate flex-1">{address || t('loading')}</span>
        </div>

        {/* Distance totale */}
        <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
          <span className="text-gray-500">{t('totalDistance')}</span>
          <span className="font-semibold">{mileage}</span>
        </div>

        {/* Boutons Alertes et Incidents */}
        <div className="flex gap-2 mt-3">
          <AlertButton 
            icon="pi pi-exclamation-triangle"
            label={`Alerte${alertCount > 1 ? 's' : ''}`}
            count={alertCount}
            variant="danger"
            onClick={(e) => e.preventDefault()}
          />
          <AlertButton 
            icon="pi pi-times-circle"
            label={`Incident${incidentCount > 1 ? 's' : ''}`}
            count={incidentCount}
            variant="warning"
            onClick={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </Link>
  );
}
