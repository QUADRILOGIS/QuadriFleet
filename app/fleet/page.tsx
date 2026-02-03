"use client";

import { useTranslations } from "next-intl";
import FleetPageHeader from "@/components/FleetPageHeader";
import dynamic from 'next/dynamic';
import TrailerListItem from "@/components/TrailerListItem";
import { determineStatus } from "@/utils";
import { useTrailers, useAlerts, useIncidents } from "@/lib/api";
import { useState } from "react";
import { Search, Bike, Map, AlertTriangle, Info } from "lucide-react";

const TrailerMapWithT = dynamic(() => import('@/components/TrailerMap'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">Chargement de la carte...</div>
});

type ViewMode = 'list' | 'map';
type StatusFilter = 'all' | 'On Mission' | 'Available' | 'Maintenance';

export default function Home() {
  const t = useTranslations("FleetPage");
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [alertFilter, setAlertFilter] = useState(false);
  const [incidentFilter, setIncidentFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { trailers: vehicles, loading } = useTrailers();
  const { alerts } = useAlerts();
  const { incidents } = useIncidents();

  const trailersWithAlerts = new Set(alerts?.map(a => a.trailer_id) || []);
  const trailersWithIncidents = new Set(incidents?.map(i => i.trailer_id) || []);

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const status = determineStatus(vehicle);
      return statusFilter === 'all' || status === statusFilter;
    })
    .filter((vehicle) => {
      const serial = `QU-${vehicle.id.toString().padStart(3, '0')}-IS`;
      return serial.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((vehicle) => {
      if (alertFilter && !trailersWithAlerts.has(vehicle.id)) return false;
      if (incidentFilter && !trailersWithIncidents.has(vehicle.id)) return false;
      return true;
    });

  const activeVehiclesCount = vehicles.filter(vehicle => 
    determineStatus(vehicle) === "On Mission"
  ).length;

  const statusChips: { label: string; value: StatusFilter; activeClass: string }[] = [
    { label: t('statusOnMission'), value: 'On Mission', activeClass: 'bg-gray-900 text-white' },
    { label: t('statusAvailable'), value: 'Available', activeClass: 'bg-gray-900 text-white' },
    { label: t('statusMaintenance'), value: 'Maintenance', activeClass: 'bg-gray-900 text-white' },
  ];

  const getEmptyMessage = (): string => {
    const filters: string[] = [];
    
    if (statusFilter !== 'all') {
      const statusLabel = statusChips.find(c => c.value === statusFilter)?.label || statusFilter;
      filters.push(statusLabel.toLowerCase());
    }
    if (alertFilter) filters.push(t('withAlerts'));
    if (incidentFilter) filters.push(t('withIncidents'));
    if (searchQuery) filters.push(`"${searchQuery}"`);
    
    if (filters.length === 0) {
      return t('noVehicleOn');
    }
    return `${t('noVehicle')} ${filters.join(' ')}`;
  };

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
    <main className="lg:h-screen lg:flex lg:flex-col lg:overflow-hidden pb-16 lg:pb-0">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:overflow-hidden">
        {/* Header */}
        <FleetPageHeader
          title={t('title')}
          vehicleCount={vehicles.length}
          activeCount={activeVehiclesCount}
        />

        {/* View Toggle - Mobile */}
        <div className="flex justify-center mt-4 lg:hidden">
          <div className="inline-flex bg-gray-100 rounded-full p-1 w-48">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center h-10 rounded-full transition-all ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'
              }`}
              aria-label={t('viewList')}
            >
              <Bike size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center h-10 rounded-full transition-all ${
                viewMode === 'map' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'
              }`}
              aria-label={t('viewMap')}
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(statusFilter === chip.value ? 'all' : chip.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                statusFilter === chip.value
                  ? chip.activeClass
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
          
          {/* Alert Filter */}
          <button
            onClick={() => setAlertFilter(!alertFilter)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
              alertFilter
                ? 'bg-orange-100 border-orange-400 text-orange-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
            aria-label={t('filterAlerts')}
          >
            <AlertTriangle size={18} />
          </button>
          
          {/* Incident Filter */}
          <button
            onClick={() => setIncidentFilter(!incidentFilter)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
              incidentFilter
                ? 'bg-red-100 border-red-400 text-red-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
            aria-label={t('filterIncidents')}
          >
            <Info size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 mt-4 lg:overflow-hidden">
          {/* Mobile: Conditional View - Uses page scroll for list */}
          <div className="lg:hidden">
            {viewMode === 'list' ? (
              <div className="space-y-3 pb-4">
                {filteredVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bike size={48} className="mb-3 opacity-30" />
                    <p className="text-center">{getEmptyMessage()}</p>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TrailerListItem key={vehicle.id} trailer={vehicle} />
                  ))
                )}
              </div>
            ) : (
              <div className="h-[calc(100vh-320px)] min-h-[400px] rounded-lg overflow-hidden">
                <TrailerMapWithT vehicles={filteredVehicles} showLegend={false} />
              </div>
            )}
          </div>

          {/* Desktop: Side by Side */}
          <div className="hidden lg:grid lg:grid-cols-[2fr_1fr] gap-6 h-full">
            <div className="flex flex-col min-h-0">
              <h2 className="text-lg font-semibold mb-3">{t('mapTitle')}</h2>
              <div className="flex-1 relative min-h-0 rounded-lg overflow-hidden">
                <TrailerMapWithT vehicles={filteredVehicles} showLegend={true} />
              </div>
            </div>

            <div className="flex flex-col min-h-0">
              <h2 className="text-lg font-semibold mb-3">{t('fleetListTitle')}</h2>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                {filteredVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bike size={48} className="mb-3 opacity-30" />
                    <p className="text-center">{getEmptyMessage()}</p>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TrailerListItem key={vehicle.id} trailer={vehicle} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}