"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AlertThresholds from "@/components/AlertThresholds";
import { Divider } from "primereact/divider";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { apiClient, fetchPieces, updatePiece as updatePieceApi, type Piece } from "@/lib/api";
import { LogOut, Loader2 } from "lucide-react";

export default function Page() {
  const t = useTranslations("SettingsPage");
  const router = useRouter();
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const loadPieces = async () => {
      try {
        setLoading(true);
        const data = await fetchPieces();
        setPieces(data);
      } catch (err) {
        setError(t("error"));
        console.error("Failed to fetch pieces:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPieces();
  }, [t]);

  const updatePiece = useCallback(async (id: number, trigger_limit: number, warning_percent: number) => {
    const piece = pieces.find(p => p.id === id);
    if (!piece) return;
    
    setSavingId(id);
    try {
      await updatePieceApi(id, {
        name: piece.name,
        trigger_limit,
        warning_percent,
      });
      
      setPieces(prev => prev.map(p => 
        p.id === id ? { ...p, trigger_limit, warning_percent } : p
      ));
    } catch (err) {
      console.error("Failed to update piece:", err);
    } finally {
      setSavingId(null);
    }
  }, [pieces]);

  const getPartLabel = (name: string): string => {
    try {
      return t(`parts.${name}`);
    } catch {
      return name;
    }
  };

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} />
            <span>{t("signOut")}</span>
          </button>
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
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">{t("loading")}</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <AlertThresholds
              pieces={pieces}
              getPartLabel={getPartLabel}
              onUpdate={updatePiece}
              savingId={savingId}
            />
          )}
        </section>
      </div>
    </main>
  );
}
