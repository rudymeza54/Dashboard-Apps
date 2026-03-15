import { useEffect, useState } from "react";
import InfoTooltip from "./InfoTooltip";

const API_BASE = import.meta.env.VITE_API_BASE;
console.log("API BASE:", import.meta.env.VITE_API_BASE);


export default function OutcomeBreakdown() {
  const [data, setData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchOutcomes() {
      try {
        const res = await fetch(`${API_BASE}/api/outcomes`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Outcome fetch failed:", error);
      }
    }

    fetchOutcomes();
  }, []);

  if (data.length === 0) {
    return (
      <div className="panel">
        <div className="section-title-row">
          <div className="ptitle">Outcome Breakdown</div>
          <InfoTooltip text="Shows the latest distribution of final claim outcomes for the selected period." />
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  const maxPct = Math.max(...data.map((d) => d.pct));

  function getBarColor(label) {
    if (label === "Denied") return "#c0392b";
    if (label === "Manual Rev") return "#2f555a";
    return "#1f3539";
  }

  function handleMove(e, item) {
    const panelRect = e.currentTarget.closest(".outcome-panel").getBoundingClientRect();

    setHovered(item);
    setMousePos({
      x: e.clientX - panelRect.left,
      y: e.clientY - panelRect.top,
    });
  }

  function handleLeave() {
    setHovered(null);
  }

  return (
    <div className="panel outcome-panel">
      <div className="section-title-row">
        <div className="ptitle">Outcome Breakdown</div>
        <InfoTooltip text="Displays the latest percent split across approved, manual review, denied, and error or void outcomes." />
      </div>

      {data.map((d) => (
        <div className="outcome-row" key={d.label}>
          <div className="outcome-label">{d.label}</div>

          <div
            className="outcome-track"
            onMouseMove={(e) => handleMove(e, d)}
            onMouseLeave={handleLeave}
          >
            <div
              className="outcome-bar"
              style={{
                width: `${(d.pct / maxPct) * 100}%`,
                background: getBarColor(d.label),
              }}
            />
          </div>

          <div className="outcome-value">{d.pct.toFixed(1)}%</div>
        </div>
      ))}

      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${mousePos.x + 16}px`,
            top: `${mousePos.y - 10}px`,
          }}
        >
          <div className="chart-tooltip-date">{hovered.label}</div>
          <div>Count: {hovered.value.toLocaleString()}</div>
          <div>Percent: {hovered.pct.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}