import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function ConnexionPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <section className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="text-center">
            <h1 className="mt-3 text-3xl font-semibold tracking-[0.2em] md:text-4xl">
              CONNEXION
            </h1>
          </div>

          <form className="w-full max-w-xl space-y-6">
            <div className="flex justify-end text-xs">
              <Link href="#" className="rounded-full px-3 py-1 transition">
                Pas encore inscrit ?
              </Link>
            </div>

            <div className="space-y-5">
              <InputText
                id="email"
                placeholder="Adresse e-mail"
                className="w-full"
              />

              <InputText
                type="password"
                placeholder="Mot de passe"
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <Link href="#" className="transition">
                Mot de passe oublié ?
              </Link>

              <Button type="submit" label="Connexion" />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
