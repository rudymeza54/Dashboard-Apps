

console.log("API BASE:", import.meta.env.VITE_API_BASE);

import "./PipelineDashboard.css";
import { useEffect, useState } from "react";

import Header from "./Header";
import KPICard from "./KPICard";
import FunnelSection from "./FunnelSection";
import ConversionRates from "./ConversionRates";
import OutcomeBreakdown from "./OutcomeBreakdown";
import TrendChart from "./TrendChart";

const API_BASE = import.meta.env.VITE_API_BASE;


const defaultKpis = [
  {
    id: "ingested",
    label: "Ingested",
    value: "42.1K",
    delta: "▲ 9.2%",
    tooltip: "Total claims received into the pipeline for the selected period.",
    sparkData: [],
  },
  {
    id: "validated",
    label: "Validated",
    value: "41.8K",
    delta: "99.3% pass",
    tooltip: "Claims that passed validation checks such as required fields and business rules.",
    sparkData: [],
  },
  {
    id: "auto_decided",
    label: "Auto-Decided",
    value: "39.8K",
    delta: "94.7% rate",
    tooltip: "Claims automatically processed without manual intervention.",
    sparkData: [],
  },
  {
    id: "manual_review",
    label: "Manual Review",
    value: "2,043",
    delta: "▼ 31%",
    tooltip: "Claims routed to manual review because they require exception handling.",
    sparkData: [],
  },
];


function movingAverageSeries(series, windowSize = 3) {
  return series.map((point, i, arr) => {
    const start = Math.max(0, i - windowSize + 1);
    const slice = arr.slice(start, i + 1);
    const avg =
      slice.reduce((sum, p) => sum + p.value, 0) / slice.length;

    return {
      date: point.date,
      value: avg,
    };
  });
}

function formatKpiValue(num) {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
}

function formatDeltaPct(num) {
  const absVal = Math.abs(num).toFixed(1);
  return num >= 0 ? `▲ ${absVal}%` : `▼ ${absVal}%`;
}

function movingAverage(arr, windowSize = 3) {
  return arr.map((_, i, a) => {
    const start = Math.max(0, i - windowSize + 1);
    const slice = a.slice(start, i + 1);
    const sum = slice.reduce((s, v) => s + v, 0);
    return sum / slice.length;
  });
}

export default function PipelineDashboard() {
  const [kpis, setKpis] = useState(defaultKpis);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [kpiRes, trendRes] = await Promise.all([
          fetch(`${API_BASE}/api/kpis`),
          fetch(`${API_BASE}/api/trend`),
        ]);

        const kpiData = await kpiRes.json();
        const trendData = await trendRes.json();

        const ingestedTrend = movingAverageSeries(
          trendData.map((d) => ({
            date: d.date,
            value: d.ingested,
          })),
          3
        );

        const validatedTrend = movingAverageSeries(
          trendData.map((d) => ({
            date: d.date,
            value: d.validated ?? d.ingested * 0.98,
          })),
          3
        );

        const autoDecidedTrend = movingAverageSeries(
          trendData.map((d) => ({
            date: d.date,
            value: d.auto_decided,
          })),
          3
        );

        const manualTrend = movingAverageSeries(
          trendData.map((d) => ({
            date: d.date,
            value: d.manual_review,
          })),
          3
        );

        setKpis([
          {
            ...defaultKpis[0],
            value: formatKpiValue(kpiData.ingested.value),
            delta: formatDeltaPct(kpiData.ingested.delta),
            sparkData: ingestedTrend,
          },
          {
            ...defaultKpis[1],
            value: formatKpiValue(kpiData.validated.value),
            delta: kpiData.validated.delta_text,
            sparkData: validatedTrend,
          },
          {
            ...defaultKpis[2],
            value: formatKpiValue(kpiData.auto_decided.value),
            delta: kpiData.auto_decided.delta_text,
            sparkData: autoDecidedTrend,
          },
          {
            ...defaultKpis[3],
            value: kpiData.manual_review.value.toLocaleString(),
            delta: formatDeltaPct(kpiData.manual_review.delta),
            sparkData: manualTrend,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div>
      <Header />

      <div className="canvas">
        <div className="grid grid-4">
          {kpis.map((item) => (
            <KPICard
              key={item.id}
              label={item.label}
              value={item.value}
              delta={item.delta}
              tooltip={item.tooltip}
              sparkData={item.sparkData}
            />
          ))}
        </div>

        <div className="grid grid-2-1">
          <FunnelSection />
          <ConversionRates />
        </div>

        <div className="grid grid-1-2">
          <OutcomeBreakdown />
          <TrendChart />
        </div>
      </div>
    </div>
  );
}