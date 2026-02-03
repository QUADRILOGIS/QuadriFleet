import { Tag } from "primereact/tag";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTrailerAlertsCount } from "@/lib/api";
import { reverseGeocode } from "@/lib/geocoding";
import { Battery, MapPin } from "lucide-react";
import { 
  determineStatus, 
  getBatteryTextColor,
  getBatteryHexColor,
  getStatusSeverity,
} from "@/utils";
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
      .then(setAddress)
      .catch(() => setAddress(`${trailer.actual_pos_lat}, ${trailer.actual_pos_long}`));
  }, [trailer.actual_pos_lat, trailer.actual_pos_long]);
  
  const status = determineStatus(trailer);
  
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
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header: Serial + Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-bold text-base text-gray-900">{trailer.serial_number}</h3>
            
            {/* Battery */}
            <div className="flex items-center gap-1.5 mt-1">
              <Battery 
                size={16} 
                strokeWidth={2}
                color={getBatteryHexColor(trailer.battery_level || 0)}
              />
              <span className={`font-medium text-sm ${getBatteryTextColor(trailer.battery_level || 0)}`}>
                {(trailer.battery_level || 0).toFixed(0)}%
              </span>
            </div>
            
            {/* Location */}
            <div className="flex items-start gap-1.5 mt-1 text-gray-500 text-sm">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">{address || t('loading')}</span>
            </div>
          </div>
          
          <Tag 
            value={getStatusLabel(status)} 
            severity={getStatusSeverity(status)} 
            className="text-xs px-3 py-1 rounded-full flex-shrink-0"
          />
        </div>

        {/* Distance parcourue */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-gray-500 text-sm">Distance parcourue</span>
          <span className="font-bold text-xl text-gray-900">{trailer.daily_km_traveled} km</span>
        </div>

        {/* Alertes et Incidents */}
        <div className="flex gap-2">
          <button 
            className={`flex-1 px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
              alertCount > 0 
                ? 'border-gray-200 bg-orange-50 text-orange-700' 
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
            onClick={(e) => e.preventDefault()}
          >
            {alertCount} alerte{alertCount !== 1 ? 's' : ''}
          </button>
          <button 
            className={`flex-1 px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
              incidentCount > 0 
                ? 'border-gray-200 bg-red-50 text-red-700' 
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
            onClick={(e) => e.preventDefault()}
          >
            {incidentCount} incident{incidentCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </Link>
  );
}
