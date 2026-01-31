"use client";

import { Tag } from "primereact/tag";
import { getSeriousnessColor, getSeriousnessSeverity, formatDateTime } from "@/utils";
import type { Incident } from "@/types";

interface IncidentListProps {
  incidents: Incident[];
  title: string;
  noIncidentsText: string;
  severityLabel: string;
}

export default function IncidentList({ incidents, title, noIncidentsText, severityLabel }: IncidentListProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Tag value={incidents.length.toString()} severity="danger" />
      </div>
      {incidents.length > 0 ? (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-3 rounded-lg border ${getSeriousnessColor(incident.seriousness)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{severityLabel}</span>
                <Tag value={`${incident.seriousness}/10`} severity={getSeriousnessSeverity(incident.seriousness)} />
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
