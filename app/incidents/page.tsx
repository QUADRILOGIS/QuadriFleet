"use client";

import {useTranslations} from "next-intl";
import {useIncidents} from "@/lib/api";
import {useState} from "react";
import IncidentCard from "@/components/ui/IncidentCard";

export default function IncidentsPage() {
    const t = useTranslations("IncidentsPage");
    const { incidents, loading } = useIncidents();
    const [sortDesc, setSortDesc] = useState(true);

    const sortedIncidents = [...(incidents ?? [])].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDesc ? dateB - dateA : dateA - dateB;
    });

    return (
        <main className="p-6 pb-20">

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400">
                        {t("activeCount", { count: incidents?.length ?? 0 })}
                    </p>
                </div>


                {/*
                <button
                    onClick={() => setSortDesc(!sortDesc)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm text-gray-700 hover:bg-gray-50"
                >
                    <ArrowDownUp size={16} />
                    {sortDesc ? t("sortNewest") : t("sortOldest")}
                </button>
                */}
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:flex-wrap">
            {loading ? (
                    <div className="text-center text-gray-400 py-12">
                        {t("loading")}
                    </div>
                ) : sortedIncidents.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        {t("empty")}
                    </div>
                ) : (
                    sortedIncidents.map((incident) => (
                        <IncidentCard key={incident.id} incident={incident} />
                    ))
                )}
            </div>
        </main>
    );
}
