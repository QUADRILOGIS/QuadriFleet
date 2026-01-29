"use client";

import { useTranslations } from "next-intl";
import { Button } from "primereact/button";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <>
      <LocaleSwitcher />
      <div className="text-3xl">{t("title")}</div>
      <Button label="OK" icon="pi pi-check" />
    </>
  );
}
