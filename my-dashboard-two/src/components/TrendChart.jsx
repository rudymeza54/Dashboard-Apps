import { useEffect, useRef, useState } from "react";

console.log("API BASE:", import.meta.env.VITE_API_BASE);

const API_BASE = import.meta.env.VITE_API_BASE;

function buildPoints(data, key, width, height, padding, minY, maxY) {
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return data
    .map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * innerWidth;
      const y =
        padding.top +
        (1 - (d[key] - minY) / (maxY - minY || 1)) * innerHeight;

      return `${x},${y}`;
    })
    .join(" ");
}

export default function TrendChart() {
  const [trendData, setTrendData] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    async function fetchTrend() {
      try {
        const response = await fetch(`${API_BASE}/api/trend`);
        const data = await response.json();
        setTrendData(data);
      } catch (error) {
        console.error("Trend fetch failed:", error);
      }
    }

    fetchTrend();
  }, []);

  if (trendData.length === 0) {
    return (
      <div className="panel">
        <div className="ptitle">Daily Processing Pipeline</div>
        <div>Loading...</div>
      </div>
    );
  }

  const width = 760;
  const height = 250;
  const padding = { top: 30, right: 20, bottom: 35, left: 20 };

  const allValues = trendData.flatMap((d) => [
    d.ingested,
    d.auto_decided,
    d.manual_review,
  ]);

  const minY = Math.min(...allValues) * 0.9;
  const maxY = Math.max(...allValues) * 1.05;

  const ingestedPoints = buildPoints(
    trendData,
    "ingested",
    width,
    height,
    padding,
    minY,
    maxY
  );

  const autoDecidedPoints = buildPoints(
    trendData,
    "auto_decided",
    width,
    height,
    padding,
    minY,
    maxY
  );

  const manualPoints = buildPoints(
    trendData,
    "manual_review",
    width,
    height,
    padding,
    minY,
    maxY
  );

  function handleMouseMove(e) {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const svgRect = svg.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - wrapperRect.top;

    const innerWidth = svgRect.width - padding.left - padding.right;
    const relativeX = Math.max(0, Math.min(mouseX - padding.left, innerWidth));
    const index = Math.round((relativeX / innerWidth) * (trendData.length - 1));

    setHoverIndex(index);
    setMousePos({
      x: e.clientX - wrapperRect.left,
      y: mouseY,
    });
  }

  function handleMouseLeave() {
    setHoverIndex(null);
  }

  const hovered = hoverIndex !== null ? trendData[hoverIndex] : null;

  const hoveredX =
    hoverIndex !== null
      ? padding.left +
        (hoverIndex / (trendData.length - 1 || 1)) *
          (width - padding.left - padding.right)
      : null;

  return (
    <div className="panel trend-panel">
      <div className="ptitle">Daily Processing Pipeline</div>

      <div className="legend">
        <div><span className="legend-line"></span> Ingested</div>
        <div><span className="legend-line"></span> Auto-Decided</div>
        <div><span className="legend-line manual"></span> Manual</div>
      </div>

      <div className="trend-chart-wrap" ref={wrapperRef}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <line x1="20" y1="50" x2="740" y2="50" stroke="#ececec" />
          <line x1="20" y1="100" x2="740" y2="100" stroke="#ececec" />
          <line x1="20" y1="150" x2="740" y2="150" stroke="#ececec" />
          <line x1="20" y1="200" x2="740" y2="200" stroke="#ececec" />

          <polyline
            points={ingestedPoints}
            fill="none"
            stroke="#23393d"
            strokeWidth="3"
          />

          <polyline
            points={autoDecidedPoints}
            fill="none"
            stroke="#23393d"
            strokeWidth="3"
            opacity="0.8"
          />

          <polyline
            points={manualPoints}
            fill="none"
            stroke="#50d19a"
            strokeWidth="3"
            strokeDasharray="7 4"
          />

          {hoveredX !== null && (
            <line
              x1={hoveredX}
              y1={padding.top}
              x2={hoveredX}
              y2={height - padding.bottom}
              stroke="#bfc7c9"
              strokeDasharray="4 4"
            />
          )}

          <text x="20" y="235" className="axis-label">
            {trendData[0].date}
          </text>
          <text x="250" y="235" className="axis-label">
            {trendData[Math.floor(trendData.length * 0.33)]?.date}
          </text>
          <text x="480" y="235" className="axis-label">
            {trendData[Math.floor(trendData.length * 0.66)]?.date}
          </text>
          <text x="680" y="235" className="axis-label">
            {trendData[trendData.length - 1].date}
          </text>

          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="transparent"
            pointerEvents="all"
          />
        </svg>

        {hovered && (
          <div
            className="chart-tooltip floating"
            style={{
              left: `${mousePos.x + 16}px`,
              top: `${mousePos.y - 10}px`,
            }}
          >
            <div className="chart-tooltip-date">{hovered.date}</div>
            <div>Ingested: {hovered.ingested.toLocaleString()}</div>
            <div>Auto-Decided: {hovered.auto_decided.toLocaleString()}</div>
            <div>Manual: {hovered.manual_review.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}