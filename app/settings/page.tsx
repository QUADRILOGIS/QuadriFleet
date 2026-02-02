"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AlertThresholds, {
  type AlertThresholdItem,
} from "@/components/AlertThresholds";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { apiClient } from "@/lib/api/client";

export default function Page() {
  const t = useTranslations("SettingsPage");
  const router = useRouter();

  const alertConfig: AlertThresholdItem[] = [
    {
      key: "tires",
      label: t("parts.tires"),
      min: 20000,
      max: 100000,
      step: 1000,
      value: 50000,
    },
    {
      key: "brakes",
      label: t("parts.brakes"),
      min: 10000,
      max: 40000,
      step: 500,
      value: 20000,
    },
    {
      key: "suspension",
      label: t("parts.suspension"),
      min: 10000,
      max: 60000,
      step: 1000,
      value: 30000,
    },
    {
      key: "axles",
      label: t("parts.axles"),
      min: 15000,
      max: 80000,
      step: 1000,
      value: 40000,
    },
    {
      key: "battery",
      label: t("parts.battery"),
      min: 10000,
      max: 50000,
      step: 1000,
      value: 25000,
    },
    {
      key: "lubrication",
      label: t("parts.lubrication"),
      min: 100,
      max: 2000,
      step: 100,
      value: 500,
    },
    {
      key: "engine",
      label: t("parts.engine"),
      min: 20000,
      max: 80000,
      step: 1000,
      value: 30000,
    },
  ];

  const [alertValues, setAlertValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(alertConfig.map(({ key, value }) => [key, value])),
  );

  const handleLogout = async () => {
    await apiClient.post("/api/auth/logout");

    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <main className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold uppercase tracking-wide">
            {t("title")}
          </h1>
          <Button
            label={t("signOut")}
            icon="pi pi-sign-out"
            severity="secondary"
            outlined
            onClick={handleLogout}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-surface-600">
            {t("languageLabel")}
          </span>
          <LocaleSwitcher />
        </div>

        <Divider />

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              {t("maintenanceTitle")}
            </h2>
            <p className="text-sm text-surface-600">
              {t("maintenanceDescription")}
            </p>
          </div>
          <AlertThresholds
            items={alertConfig}
            values={alertValues}
            onChange={(nextValues) => setAlertValues(nextValues)}
          />
        </section>
      </div>
    </main>
  );
}
