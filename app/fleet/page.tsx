"use client";

import { useTranslations } from "next-intl";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import FleetPageHeader from "@/components/FleetPageHeader";
import dynamic from 'next/dynamic';
import TrailerListItem from "@/components/TrailerListItem";
import { determineStatus } from "@/utils";
import { useTrailers } from "@/lib/api";
import { useState } from "react";

const TrailerMapWithT = dynamic(() => import('@/components/TrailerMap'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">Chargement de la carte...</div>
});


export default function Home() {
  const t = useTranslations("FleetPage");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { trailers: vehicles, loading } = useTrailers();

  const statusOptions = [
    { label: t('statusAll'), value: "all" },
    { label: t('statusAvailable'), value: "Available" },
    { label: t('statusOnMission'), value: "On Mission" },
    { label: t('statusMaintenance'), value: "Maintenance" },
    { label: t('statusUnavailable'), value: "Unavailable" },
  ];

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const status = determineStatus(vehicle);
      return statusFilter === "all" || status === statusFilter;
    })
    .filter((vehicle) => {
      const serial = `QU-${vehicle.id.toString().padStart(3, '0')}-IS`;
      return serial.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const activeVehiclesCount = vehicles.filter(vehicle => 
    determineStatus(vehicle) === "On Mission"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-center text-lg">{t('loading')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <FleetPageHeader
          title={t('title')}
          vehicleCount={vehicles.length}
          activeCount={activeVehiclesCount}
        />

        <div className="flex flex-wrap gap-3 mt-4 mb-4">
          <IconField iconPosition="left" className="flex-1 min-w-[200px]">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText 
              placeholder={t('searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </IconField>
          <Dropdown
            id="status-filter"
            value={statusFilter}
            options={statusOptions}
            onChange={(event) => setStatusFilter(event.value)}
            placeholder={t('statusPlaceholder')}
            className="w-48"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6 overflow-hidden">
          <div className="flex flex-col min-h-[300px] lg:min-h-0">
            <h2 className="text-lg font-semibold mb-3">{t('mapTitle')}</h2>
            <div className="flex-1 relative min-h-0">
              <TrailerMapWithT vehicles={filteredVehicles} showLegend={true} />
            </div>
          </div>

          <div className="flex flex-col min-h-[300px] lg:min-h-0">
            <h2 className="text-lg font-semibold mb-3">{t('fleetListTitle')}</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
              {filteredVehicles.map((vehicle) => (
                <TrailerListItem key={vehicle.id} trailer={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}