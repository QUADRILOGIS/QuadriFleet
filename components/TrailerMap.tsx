"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect } from "react";
import { determineStatus } from "@/utils";
import { useTranslations } from "next-intl";
import type { ApiTrailer } from "@/types";

interface TrailerMapProps {
  lat?: number;
  lng?: number;
  status?: string;
  vehicles?: ApiTrailer[];
  showLegend?: boolean;
}

export default function TrailerMap({ lat, lng, status, vehicles, showLegend = false }: TrailerMapProps) {
  const t = useTranslations("FleetPage");
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const getMarkerColor = (markerStatus: string) => {
    switch (markerStatus) {
      case "Available":
        return "#22c55e";
      case "On Mission":
        return "#ebb813";
      case "Charging":
        return "#3b82f6";
      case "Maintenance":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const createCustomIcon = (markerStatus: string, size: number = 50) => {
    const color = getMarkerColor(markerStatus);

    return L.divIcon({
      className: "custom-bike-marker",
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px;">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: ${size}px;
            height: ${size}px;
            background-color: white;
            border-radius: 50%;
            border: 3px solid ${color};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          ">
            <img src="https://cdn-icons-png.flaticon.com/512/9737/9737382.png" 
                 style="width: 33px; height: 33px; display: block; margin-bottom: 7px;"
                 alt="bike" />
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Mode multi-véhicules (pour la page de gestion de flotte)
  if (vehicles && vehicles.length > 0) {
    const defaultCenter: [number, number] = [47.2184, -1.5536]; // TODO Nantes à changer avec coordonées entrepot de param
    
    return (
      <div className="h-full rounded-lg overflow-hidden border">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
          >
            {vehicles.map((vehicle) => {
              const vehicleLat = parseFloat(vehicle.actual_pos_lat);
              const vehicleLng = parseFloat(vehicle.actual_pos_long);
              if (!vehicleLat || !vehicleLng) return null;
              
              const vehicleStatus = determineStatus(vehicle);
              const serial = `QU-${vehicle.id.toString().padStart(3, "0")}-IS`;
              
              return (
                <Marker
                  key={vehicle.id}
                  position={[vehicleLat, vehicleLng]}
                  icon={createCustomIcon(vehicleStatus, 40)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{serial}</strong>
                      <br />
                      {vehicleStatus}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        {showLegend && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
            <h3 className="font-semibold mb-2 text-sm">{t("legend")}</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                <span>{t("legendAvailable")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ebb813]"></div>
                <span>{t("legendOnMission")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
                <span>{t("legendCharging")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                <span>{t("legendMaintenance")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode single (pour la page de détail)
  if (lat !== undefined && lng !== undefined && status) {
    return (
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={createCustomIcon(status)}>
          <Popup>
            <div className="text-sm">
              <strong>Position actuelle</strong>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    );
  }

  return null;
}
