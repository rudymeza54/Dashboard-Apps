
/* Linraries*/

import { useEffect, useState } from "react";
import InfoTooltip from "./InfoTooltip";

const API_BASE = import.meta.env.VITE_API_BASE;

console.log("API BASE:", import.meta.env.VITE_API_BASE);

export default function FunnelSection() {
  const [funnelData, setFunnelData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchFunnel() {
      try {
        const response = await fetch(`${API_BASE}/api/funnel`);
        const data = await response.json();
        setFunnelData(data);
      } catch (error) {
        console.error("Funnel fetch failed:", error);
      }
    }

    fetchFunnel();
  }, []);

  if (funnelData.length === 0) {
    return (
      <div className="panel">
        <div className="section-title-row">
          <div className="ptitle">Claims Processing Funnel</div>
          <InfoTooltip text="Displays the latest pipeline stage totals and drop-off through the workflow." />
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  const maxValue = funnelData[0].value;

  function handleMove(e, stage, pct) {
    const panelRect = e.currentTarget.closest(".funnel-panel").getBoundingClientRect();

    setHovered({
      stage: stage.stage,
      value: stage.value,
      pct,
    });

    setMousePos({
      x: e.clientX - panelRect.left,
      y: e.clientY - panelRect.top,
    });
  }

  function handleLeave() {
    setHovered(null);
  }

  return (
    <div className="panel funnel-panel">
      <div className="section-title-row">
        <div className="ptitle">Claims Processing Funnel</div>
        <InfoTooltip text="Shows the latest stage counts and the percent remaining relative to the first stage." />
      </div>

      {funnelData.map((stage) => {
        const pct = ((stage.value / maxValue) * 100).toFixed(1);

        return (
          <div className="funnel-row" key={stage.stage}>
            <div className="funnel-label">{stage.stage}</div>

            <div
              className="funnel-track"
              onMouseMove={(e) => handleMove(e, stage, pct)}
              onMouseLeave={handleLeave}
            >
              <div
                className="funnel-bar"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div>{stage.value.toLocaleString()}</div>
            <div>{pct}%</div>
          </div>
        );
      })}

      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${mousePos.x + 16}px`,
            top: `${mousePos.y - 10}px`,
          }}
        >
          <div className="chart-tooltip-date">{hovered.stage}</div>
          <div>Value: {hovered.value.toLocaleString()}</div>
          <div>Percent of Ingested: {hovered.pct}%</div>
        </div>
      )}
    </div>
  );
}