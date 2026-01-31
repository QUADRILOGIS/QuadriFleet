interface FleetPageHeaderProps {
  title: string;
  vehicleCount?: number;
  activeCount?: number;
}

export default function FleetPageHeader({ title, vehicleCount, activeCount }: FleetPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{title}</h1>
        {(vehicleCount !== undefined || activeCount !== undefined) && (
          <p className="text-sm text-gray-600">
            {vehicleCount !== undefined && `${vehicleCount} véhicules`}
            {vehicleCount !== undefined && activeCount !== undefined && ' • '}
            {activeCount !== undefined && `${activeCount} actifs`}
          </p>
        )}
      </div>
    </div>
  );
}
