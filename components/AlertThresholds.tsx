"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";

export type AlertThresholdItem = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

type AlertThresholdsProps = {
  items: AlertThresholdItem[];
  values?: Record<string, number>;
  onChange?: (
    nextValues: Record<string, number>,
    changed: { key: string; value: number },
  ) => void;
};

const getInitialValues = (items: AlertThresholdItem[]) =>
  Object.fromEntries(items.map(({ key, value }) => [key, value]));

export default function AlertThresholds({
  items,
  values,
  onChange,
}: AlertThresholdsProps) {
  const t = useTranslations("AlertThresholds");
  const [alertValues, setAlertValues] = useState<Record<string, number>>(() =>
    getInitialValues(items),
  );

  const currentValues = useMemo(
    () => values ?? alertValues,
    [alertValues, values],
  );

  const updateAlert = (
    key: string,
    value: number | number[] | null | undefined,
  ) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return;
    }
    const nextValues = { ...currentValues, [key]: value };
    if (values === undefined) {
      setAlertValues(nextValues);
    }
    onChange?.(nextValues, { key, value });
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-5">
        {items.map((alert) => (
          <div
            key={alert.key}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-base font-semibold uppercase tracking-wide">
                  {alert.label}
                </div>
                <div className="text-xs text-surface-500">
                  {t("thresholdLabel")}
                </div>
              </div>
              <InputNumber
                value={currentValues[alert.key] ?? alert.value}
                onValueChange={(event) => updateAlert(alert.key, event.value)}
                min={alert.min}
                max={alert.max}
                step={alert.step}
                suffix={" km"}
                className="w-40"
                inputClassName="w-full"
              />
            </div>
            <div className="mt-4 space-y-2">
              <Slider
                value={currentValues[alert.key] ?? alert.value}
                onChange={(event) => updateAlert(alert.key, event.value)}
                min={alert.min}
                max={alert.max}
                step={alert.step}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-surface-500">
                <span>{alert.min} km</span>
                <span>{alert.max} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
