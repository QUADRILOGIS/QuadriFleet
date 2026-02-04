"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";
import { Loader2, Check } from "lucide-react";

interface Piece {
  id: number;
  name: string;
  trigger_limit: number;
  warning_percent: number;
}

type AlertThresholdsProps = {
  pieces: Piece[];
  getPartLabel: (name: string) => string;
  onUpdate: (id: number, trigger_limit: number, warning_percent: number) => Promise<void>;
  savingId: number | null;
};

export default function AlertThresholds({
  pieces,
  getPartLabel,
  onUpdate,
  savingId,
}: AlertThresholdsProps) {
  const t = useTranslations("AlertThresholds");
  const tSettings = useTranslations("SettingsPage");
  
  // État local pour les valeurs en cours d'édition
  const [localValues, setLocalValues] = useState<Record<number, { trigger_limit: number; warning_percent: number }>>({});
  // Timer pour le debounce
  const [debounceTimers, setDebounceTimers] = useState<Record<number, NodeJS.Timeout>>({});

  const handleTriggerLimitChange = (piece: Piece, value: number | null | undefined) => {
    if (typeof value !== "number" || Number.isNaN(value)) return;
    
    // Mettre à jour l'état local immédiatement
    setLocalValues(prev => ({
      ...prev,
      [piece.id]: {
        trigger_limit: value,
        warning_percent: prev[piece.id]?.warning_percent ?? piece.warning_percent,
      }
    }));

    // Annuler le timer précédent
    if (debounceTimers[piece.id]) {
      clearTimeout(debounceTimers[piece.id]);
    }

    // Définir un nouveau timer pour sauvegarder après 500ms
    const timer = setTimeout(() => {
      const currentLocal = localValues[piece.id];
      onUpdate(
        piece.id, 
        value, 
        currentLocal?.warning_percent ?? piece.warning_percent
      );
    }, 500);

    setDebounceTimers(prev => ({ ...prev, [piece.id]: timer }));
  };

  const handleWarningPercentChange = (piece: Piece, value: number | null | undefined) => {
    if (typeof value !== "number" || Number.isNaN(value)) return;
    
    setLocalValues(prev => ({
      ...prev,
      [piece.id]: {
        trigger_limit: prev[piece.id]?.trigger_limit ?? piece.trigger_limit,
        warning_percent: value,
      }
    }));

    if (debounceTimers[piece.id]) {
      clearTimeout(debounceTimers[piece.id]);
    }

    const timer = setTimeout(() => {
      const currentLocal = localValues[piece.id];
      onUpdate(
        piece.id, 
        currentLocal?.trigger_limit ?? piece.trigger_limit, 
        value
      );
    }, 500);

    setDebounceTimers(prev => ({ ...prev, [piece.id]: timer }));
  };

  const getTriggerLimit = (piece: Piece) => localValues[piece.id]?.trigger_limit ?? piece.trigger_limit;
  const getWarningPercent = (piece: Piece) => localValues[piece.id]?.warning_percent ?? piece.warning_percent;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-base font-semibold uppercase tracking-wide">
                    {getPartLabel(piece.name)}
                  </div>
                  <div className="text-xs text-surface-500">
                    {t("thresholdLabel")}
                  </div>
                </div>
                {savingId === piece.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                )}
              </div>
              <InputNumber
                value={getTriggerLimit(piece)}
                onValueChange={(event) => handleTriggerLimitChange(piece, event.value)}
                min={0}
                max={200000}
                step={1000}
                suffix={" km"}
                className="w-40"
                inputClassName="w-full"
              />
            </div>
            <div className="mt-4 space-y-2">
              <Slider
                value={getTriggerLimit(piece)}
                onChange={(event) => handleTriggerLimitChange(piece, event.value as number)}
                min={0}
                max={200000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-surface-500">
                <span>0 km</span>
                <span>200 000 km</span>
              </div>
            </div>
            
            {/* Warning Percent */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-surface-500">
                  {tSettings("warningPercent")}
                </div>
                <InputNumber
                  value={getWarningPercent(piece)}
                  onValueChange={(event) => handleWarningPercentChange(piece, event.value)}
                  min={0}
                  max={100}
                  step={1}
                  suffix=" %"
                  className="w-28"
                  inputClassName="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
