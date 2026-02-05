"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Bike, TriangleAlert, X, Clock8, AlertCircle, BarChart3 } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { apiClient } from "@/lib/api/client";
import { Divider } from "primereact/divider";

interface DailyIncident {
  date: string;
  incident_count: number;
}

interface VehicleKm {
  vehicle_id: number;
  vehicle_label: string;
  daily_km: number;
}

interface VehicleUsage {
  vehicle_id: number;
  vehicle_label: string;
  usage_minutes: number;
  usage_formatted: string;
}

interface VehicleIncident {
  vehicle_id: number;
  vehicle_label: string;
  incident_count: number;
}

interface StatsData {
  total_vehicles: number;
  active_vehicles: number;
  active_alerts: number;
  global_average: {
    total_kilometers: number;
    daily_incidents_average: number;
    daily_incidents_chart: DailyIncident[];
  };
  vehicle_average: {
    daily_kilometers: number;
    daily_usage_time: string;
    incidents_per_vehicle: number;
    incidents_per_vehicle_per_day: number;
  };
  vehicle_charts: {
    daily_kilometers: VehicleKm[];
    daily_usage: VehicleUsage[];
    incidents: VehicleIncident[];
  };
  period_days: number;
}

interface CustomChart {
  id: number;
  dataType: string;
  timeFrame: string;
}

export default function StatsPage() {
  const t = useTranslations("StatsPage");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [showGlobalIncidentChart, setShowGlobalIncidentChart] = useState(false);
  const [showVehicleKmChart, setShowVehicleKmChart] = useState(false);
  const [showVehicleUsageChart, setShowVehicleUsageChart] = useState(false);
  const [showVehicleIncidentChart, setShowVehicleIncidentChart] = useState(false);

  const [customCharts, setCustomCharts] = useState<CustomChart[]>([]);
  const [selectedDataType, setSelectedDataType] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null);
  const [chartIdCounter, setChartIdCounter] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: StatsData }>(
          "/api/dashboard/stats"
        );
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dataTypeOptions = [
    { label: t("dataTypes.kilometers"), value: "kilometers" },
    { label: t("dataTypes.incidents"), value: "incidents" },
    { label: t("dataTypes.availability"), value: "availability" },
  ];

  const timeFrameOptions = [
    { label: t("timeFrames.hourly"), value: "hourly" },
    { label: t("timeFrames.daily"), value: "daily" },
    { label: t("timeFrames.weekly"), value: "weekly" },
  ];

  const addCustomChart = () => {
    if (selectedDataType && selectedTimeFrame) {
      setCustomCharts([
        ...customCharts,
        {
          id: chartIdCounter,
          dataType: selectedDataType,
          timeFrame: selectedTimeFrame,
        },
      ]);
      setChartIdCounter(chartIdCounter + 1);
    }
  };

  const removeCustomChart = (id: number) => {
    setCustomCharts(customCharts.filter((chart) => chart.id !== id));
  };

  const getGlobalIncidentChartData = () => {
    if (!stats) return null;
    const labels = stats.global_average.daily_incidents_chart.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("fr-FR", { weekday: "short" });
    });
    const data = stats.global_average.daily_incidents_chart.map(
      (item) => item.incident_count
    );

    return {
      labels,
      datasets: [
        {
          label: t("charts.incidentsPerDay"),
          data,
          backgroundColor: "#1f2937",
          borderColor: "#1f2937",
          borderWidth: 1,
        },
      ],
    };
  };

  const getVehicleKmChartData = () => {
    if (!stats) return null;
    const labels = stats.vehicle_charts.daily_kilometers.map(
      (item) => item.vehicle_label
    );
    const data = stats.vehicle_charts.daily_kilometers.map((item) => item.daily_km);

    return {
      labels,
      datasets: [
        {
          label: t("charts.dailyKm"),
          data,
          backgroundColor: "#22c55e",
          borderColor: "#16a34a",
          borderWidth: 1,
        },
      ],
    };
  };

  const getVehicleUsageChartData = () => {
    if (!stats) return null;
    const labels = stats.vehicle_charts.daily_usage.map((item) => item.vehicle_label);
    const data = stats.vehicle_charts.daily_usage.map((item) => item.usage_minutes);

    return {
      labels,
      datasets: [
        {
          label: t("charts.usageMinutes"),
          data,
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
      ],
    };
  };

  const getVehicleIncidentChartData = () => {
    if (!stats) return null;
    const labels = stats.vehicle_charts.incidents.map((item) => item.vehicle_label);
    const data = stats.vehicle_charts.incidents.map((item) => item.incident_count);

    return {
      labels,
      datasets: [
        {
          label: t("charts.incidentsPerVehicle"),
          data,
          backgroundColor: "#ef4444",
          borderColor: "#dc2626",
          borderWidth: 1,
        },
      ],
    };
  };

  const getCustomChartData = (chart: CustomChart) => {
    if (!stats) return null;

    let labels: string[] = [];
    let data: number[] = [];
    let backgroundColor = "#3b82f6";
    let borderColor = "#2563eb";

    switch (chart.dataType) {
      case "kilometers":
        if (chart.timeFrame === "daily") {
          labels = stats.vehicle_charts.daily_kilometers.map((item) => item.vehicle_label);
          data = stats.vehicle_charts.daily_kilometers.map((item) => item.daily_km);
          backgroundColor = "#22c55e";
          borderColor = "#16a34a";
        } else {
          labels = stats.vehicle_charts.daily_kilometers.map((item) => item.vehicle_label);
          data = stats.vehicle_charts.daily_kilometers.map((item) => 
            chart.timeFrame === "hourly" ? Math.round(item.daily_km / 24) : item.daily_km * 7
          );
          backgroundColor = "#22c55e";
          borderColor = "#16a34a";
        }
        break;
      case "incidents":
        labels = stats.global_average.daily_incidents_chart.map((item) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
        });
        data = stats.global_average.daily_incidents_chart.map((item) => item.incident_count);
        backgroundColor = "#ef4444";
        borderColor = "#dc2626";
        break;
      case "availability":
        labels = stats.vehicle_charts.daily_usage.map((item) => item.vehicle_label);
        data = stats.vehicle_charts.daily_usage.map((item) => 
          Math.round((item.usage_minutes / (24 * 60)) * 100)
        );
        backgroundColor = "#8b5cf6";
        borderColor = "#7c3aed";
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: dataTypeOptions.find((opt) => opt.value === chart.dataType)?.label || "",
          data,
          borderColor,
          backgroundColor,
          tension: 0.4,
          fill: false,
        },
      ],
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const ChartToggleButtons = ({
    showChart,
    onToggle,
  }: {
    showChart: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`p-1.5 rounded ${!showChart ? "bg-gray-200" : "bg-transparent"}`}
      >
        <BarChart3 className="h-4 w-4" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-2xl font-semibold">{t("title")}</div>
        <div className="text-gray-400">{t("subtitle")}</div>
        <div className="mt-8 text-center text-gray-500">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-2xl font-semibold">{t("title")}</div>
      <div className="text-gray-400">{t("subtitle")}</div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 0 ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 1 ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {activeTab === 0 ? (
        <div className="mt-8">
          {/* Summary Cards */}
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap mb-8">
            <DashboardCard
              title={t("cards.totalVehicles")}
              value={stats?.total_vehicles ?? "—"}
              description={t("cards.activeVehicles", {
                active: stats?.active_vehicles ?? 0,
                total: stats?.total_vehicles ?? 0,
              })}
              icon={<Bike className="h-5 w-5 text-green-600" />}
            />
            <DashboardCard
              title={t("cards.alerts")}
              value={stats?.active_alerts ?? "—"}
              description={t("cards.activeAlerts")}
              icon={<TriangleAlert className="h-5 w-5 text-red-700" />}
            />
          </div>

          {/* Global Average Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {t("sections.globalAverage")}
              </h3>
              <ChartToggleButtons
                showChart={showGlobalIncidentChart}
                onToggle={() => setShowGlobalIncidentChart(!showGlobalIncidentChart)}
              />
            </div>
             <Divider className="mt-1" />

            {!showGlobalIncidentChart ? (
              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                <DashboardCard
                  title={t("cards.avgKilometers")}
                  value={`${stats?.global_average.total_kilometers ?? "—"}km`}
                  description={t("cards.ofVehicles")}
                  icon={<Bike className="h-5 w-5 text-green-600" />}
                />
                <DashboardCard
                  title={t("cards.dailyIncidents")}
                  value={stats?.global_average.daily_incidents_average.toFixed(1) ?? "—"}
                  description={t("cards.incidentsAvgDesc")}
                  icon={<AlertCircle className="h-5 w-5 text-orange-400" />}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="h-64">
                  <Chart
                    type="bar"
                    data={getGlobalIncidentChartData() ?? undefined}
                    options={chartOptions}
                    className="h-full"
                  />
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  {t("charts.incidentsPerDay")}
                </p>
              </div>
            )}
          </div>

          {/* Vehicle Average Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {t("sections.vehicleAverage")}
              </h3>
              <ChartToggleButtons
                showChart={showVehicleKmChart || showVehicleUsageChart || showVehicleIncidentChart}
                onToggle={() => {
                  const newState = !(showVehicleKmChart || showVehicleUsageChart || showVehicleIncidentChart);
                  setShowVehicleKmChart(newState);
                  setShowVehicleUsageChart(false);
                  setShowVehicleIncidentChart(false);
                }}
              />
            </div>
            <Divider className="mt-1" />

            {!showVehicleKmChart && !showVehicleUsageChart && !showVehicleIncidentChart ? (
              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                <DashboardCard
                  title={t("cards.dailyKilometers")}
                  value={`${stats?.vehicle_average.daily_kilometers ?? "—"}km`}
                  description={t("cards.avgPerVehiclePerDay")}
                  icon={<Bike className="h-5 w-5 text-green-600" />}
                />
                <DashboardCard
                  title={t("cards.dailyUsageTime")}
                  value={stats?.vehicle_average.daily_usage_time ?? "—"}
                  description={t("cards.avgPerVehiclePerDay")}
                  icon={<Clock8 className="h-5 w-5 text-blue-600" />}
                />
                <div className="rounded-xl border border-gray-200 p-3 md:w-xs">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t("cards.incidentsCount")}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-3xl font-bold">
                          {stats?.vehicle_average.incidents_per_vehicle.toFixed(1) ?? "—"}
                        </div>
                        <div className="text-xs text-gray-400">{t("cards.avgPerVehicle")}</div>
                      </div>
                    </div>
                    <div className="flex-1 border-l pl-4">
                      <div className="text-sm font-medium">{t("cards.perDay")}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-3xl font-bold">
                          {stats?.vehicle_average.incidents_per_vehicle_per_day.toFixed(1) ?? "—"}
                        </div>
                        <div className="text-xs text-gray-400">{t("cards.perVehiclePerDay")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chart selector buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowVehicleKmChart(true);
                      setShowVehicleUsageChart(false);
                      setShowVehicleIncidentChart(false);
                    }}
                    className={`px-3 py-1 text-sm rounded ${
                      showVehicleKmChart ? "bg-green-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    {t("charts.kilometers")}
                  </button>
                  <button
                    onClick={() => {
                      setShowVehicleKmChart(false);
                      setShowVehicleUsageChart(true);
                      setShowVehicleIncidentChart(false);
                    }}
                    className={`px-3 py-1 text-sm rounded ${
                      showVehicleUsageChart ? "bg-blue-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    {t("charts.usage")}
                  </button>
                  <button
                    onClick={() => {
                      setShowVehicleKmChart(false);
                      setShowVehicleUsageChart(false);
                      setShowVehicleIncidentChart(true);
                    }}
                    className={`px-3 py-1 text-sm rounded ${
                      showVehicleIncidentChart ? "bg-red-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    {t("charts.incidents")}
                  </button>
                </div>

                {showVehicleKmChart && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="h-64">
                      <Chart
                        type="bar"
                        data={getVehicleKmChartData() ?? undefined}
                        options={chartOptions}
                        className="h-full"
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {t("charts.dailyKmPerVehicle")}
                    </p>
                  </div>
                )}

                {showVehicleUsageChart && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="h-64">
                      <Chart
                        type="bar"
                        data={getVehicleUsageChartData() ?? undefined}
                        options={chartOptions}
                        className="h-full"
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {t("charts.usagePerVehicle")}
                    </p>
                  </div>
                )}

                {showVehicleIncidentChart && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="h-64">
                      <Chart
                        type="bar"
                        data={getVehicleIncidentChartData() ?? undefined}
                        options={chartOptions}
                        className="h-full"
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {t("charts.incidentsPerVehicle")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {/* Custom Chart Builder */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">{t("builder.display")}</label>
              <Dropdown
                value={selectedDataType}
                options={dataTypeOptions}
                onChange={(e) => setSelectedDataType(e.value)}
                placeholder={t("builder.selectData")}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">{t("builder.basedOn")}</label>
              <Dropdown
                value={selectedTimeFrame}
                options={timeFrameOptions}
                onChange={(e) => setSelectedTimeFrame(e.value)}
                placeholder={t("builder.selectData")}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              label={t("builder.addChart")}
              icon="pi pi-plus"
              onClick={addCustomChart}
              disabled={!selectedDataType || !selectedTimeFrame}
              className="p-button-outlined"
            />
          </div>

          {/* Custom Charts Display */}
          <div className="space-y-6">
            {customCharts.map((chart) => (
              <div key={chart.id} className="rounded-xl border border-gray-200 p-4 relative">
                <button
                  onClick={() => removeCustomChart(chart.id)}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="h-64 mt-6">
                  <Chart
                    type="line"
                    data={getCustomChartData(chart) ?? undefined}
                    options={lineChartOptions}
                    className="h-full"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {dataTypeOptions.find((opt) => opt.value === chart.dataType)?.label}{" "}
                  {timeFrameOptions.find((opt) => opt.value === chart.timeFrame)?.label?.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
