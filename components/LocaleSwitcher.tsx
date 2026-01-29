"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Dropdown } from "primereact/dropdown";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState(locale);
  const [, startTransition] = useTransition();

  const onChange = (nextLocale: string) => {
    setValue(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Dropdown
      value={value}
      options={LOCALES}
      onChange={(event) => onChange(event.value)}
    />
  );
}
