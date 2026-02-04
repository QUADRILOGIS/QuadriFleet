import { useTranslations } from 'next-intl';

interface FleetPageHeaderProps {
  title: string;
  vehicleCount?: number;
  activeCount?: number;
}

export default function FleetPageHeader({ title, vehicleCount, activeCount }: FleetPageHeaderProps) {
  const t = useTranslations('FleetPage');
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">{title}</h1>
        {(vehicleCount !== undefined || activeCount !== undefined) && (
           <p className="text-gray-400">
            {vehicleCount !== undefined && `${vehicleCount} ${t('vehiclesCount')}`}
            {vehicleCount !== undefined && activeCount !== undefined && ` ${t('ofWhich')} `}
            {activeCount !== undefined && `${activeCount} ${t('activeCount')}`}
          </p>
        )}
      </div>
    </div>
  );
}
