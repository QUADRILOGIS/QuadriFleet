"use client";

import { getAlertSeverity, formatDateTime } from "@/utils";
import type { Alert } from "@/types";

interface AlertListProps {
  alerts: Alert[];
  title: string;
  noAlertsText: string;
  getAlertLabel: (status: string) => string;
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

export default function AlertList({ alerts, title, noAlertsText, getAlertLabel }: AlertListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge value={alerts.length.toString()} severity="danger"/>
      </div>
      {alerts.length > 0 ? (
        <div className={alerts.length > 3 ? "space-y-3 max-h-[268px] overflow-y-scroll" : "space-y-3"}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-orange-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-orange-800">{alert.piece_name}</span>
                <Badge value={getAlertLabel(alert.status)} severity={getAlertSeverity(alert.status)} />
              </div>
              <p className="text-xs text-gray-500">
                {formatDateTime(alert.alert_date)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">{noAlertsText}</p>
      )}
    </div>
  );
}
