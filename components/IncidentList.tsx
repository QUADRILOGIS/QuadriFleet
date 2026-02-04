"use client";

import { getSeriousnessColor, getSeriousnessSeverity, formatDateTime } from "@/utils";
import type { Incident } from "@/types";

interface IncidentListProps {
  incidents: Incident[];
  title: string;
  noIncidentsText: string;
  severityLabel: string;
}

const Badge = ({ value, severity }: { value: string; severity: string }) => {
  const colors = {
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-orange-100 text-orange-700',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${colors[severity as keyof typeof colors] || colors.info}`}>
      {value}
    </span>
  );
};

export default function IncidentList({ incidents, title, noIncidentsText, severityLabel }: IncidentListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge value={incidents.length.toString()} severity="danger" />
      </div>
      {incidents.length > 0 ? (
        <div className={incidents.length > 3 ? "space-y-3 max-h-[300px] overflow-y-scroll" : "space-y-3"}>
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-3 rounded-lg border ${getSeriousnessColor(incident.seriousness)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{severityLabel}</span>
                <Badge value={`${incident.seriousness}/10`} severity={getSeriousnessSeverity(incident.seriousness)} />
              </div>
              <p className="text-sm">{incident.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(incident.created_at)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">{noIncidentsText}</p>
      )}
    </div>
  );
}
