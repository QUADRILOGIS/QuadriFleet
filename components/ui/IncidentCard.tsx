import {AlertCircle, Bike, Calendar} from "lucide-react";
import {Incident} from "@/types";
import {getSeverityClass} from "@/utils/incidentsSeriousnessHelpers";
import {useTranslations} from "next-intl";

export default function IncidentCard({incident}: { incident: Incident }) {
    const t = useTranslations("IncidentsPage");
    const severity = Math.round(Number(incident.seriousness));
    const serial = `QU-${incident.trailer_id.toString().padStart(3, "0")}-IS`;

    return (
        <div className="flex justify-between border border-gray-200 rounded-xl p-4
                w-full md:w-[48%] lg:w-[32%]">
        <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{t("incident")}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getSeverityClass(severity)}`}>
                        {severity}
                    </span>
                    </div>
                    <span className="text-sm text-gray-400">#{incident.id.toString()}</span>
                </div>

                <div>
                    <div className="flex items-start gap-2 text-gray-400 text-sm mt-1">

                        <span className="text-lg leading-none">≡</span>
                        <span className="max-w-[220px]">
                        {incident.message}
                    </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Bike size={16} className="text-green-600"/>
                        {serial}
                    </div>
                </div>
            </div>



            <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle size={28} strokeWidth={1}/>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={16} strokeWidth={1}/>
                    {new Date(incident.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
