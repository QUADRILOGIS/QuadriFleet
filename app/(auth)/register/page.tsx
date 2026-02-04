"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("RegisterPage");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.message || t("errors.registerFailed"));
        return;
      }

      if (data?.data?.token) {
        document.cookie = `auth_token=${data.data.token}; path=/; max-age=86400`;
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(t("errors.registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-h-[calc(100dvh-80px)] md:max-h-screen overflow-hidden p-6">
      <div className="flex">
        <LocaleSwitcher />
      </div>
      <section className="mx-auto flex min-h-screen max-w-md items-center w-full">
        <Card
          title={t("title")}
          className="w-full uppercase"
          pt={{ title: { className: "text-center tracking-[0.2em]" } }}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-end text-xs">
              <Link
                href="/login"
                className="rounded-full px-3 py-1 transition normal-case"
              >
                {t("alreadyAccount")}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputText
                id="lastName"
                placeholder={t("lastName")}
                className="w-full"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <InputText
                id="firstName"
                placeholder={t("firstName")}
                className="w-full"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <InputText
              id="email"
              placeholder={t("email")}
              className="w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="w-full">
              <Password
                inputId="password"
                placeholder={t("password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full"
                inputClassName="w-full"
                pt={{ iconField: { root: { className: "w-full" } } }}
                feedback
                toggleMask
              />
            </div>

            <div className="w-full">
              <Password
                inputId="confirm-password"
                placeholder={t("confirmPassword")}
                className="w-full"
                inputClassName="w-full"
                pt={{ iconField: { root: { className: "w-full" } } }}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                toggleMask
              />
            </div>

            {error ? <p className="text-sm normal-case">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm normal-case">
              <span />
              <Button type="submit" label={t("submit")} loading={loading} />
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
