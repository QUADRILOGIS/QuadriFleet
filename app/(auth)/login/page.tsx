"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.message || t("errors.loginFailed"));
        return;
      }

      if (data?.data?.token) {
        document.cookie = `auth_token=${data.data.token}; path=/; max-age=86400`;
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(t("errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-h-[calc(100dvh-80px)] md:max-h-screen overflow-hidden p-6">
      <div className="flex">
        <LocaleSwitcher />
      </div>
      <section className="mx-auto flex min-h-screen max-w-md items-center">
        <Card
          title={t("title")}
          className="bg-white rounded-lg border border-gray-200 p-4 uppercase"
          pt={{ title: { className: "text-center tracking-[0.2em]" } }}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-end text-xs">
              <Link
                href="/register"
                className="px-3 py-1 transition normal-case text-gray-500 hover:font-bold"
              >
                {t("noAccount")}
              </Link>
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
                className="w-full"
                inputClassName="w-full"
                pt={{ iconField: { root: { className: "w-full" } } }}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                feedback={false}
                toggleMask
              />
            </div>

            {error ? <p className="text-sm normal-case text-red-500">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm normal-case">
              <Link href="#" className="transition underline">
                {t("forgotPassword")}
              </Link>

              <Button type="submit" label={t("submit")} loading={loading} className="bg-black border-none hover:bg-gray-800" />
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
