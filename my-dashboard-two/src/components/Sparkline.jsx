import { useMemo, useState } from "react";

console.log("API BASE:", import.meta.env.VITE_API_BASE);
const API_BASE = import.meta.env.VITE_API_BASE;

function buildSparkPoints(series, width = 90, height = 42, padding = 3) {
  if (!series || series.length === 0) {
    return {
      linePoints: "",
      areaPoints: "",
      pointsArray: [],
    };
  }

  const values = series.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const pointsArray = series.map((point, i) => {
    const x = padding + (i / (series.length - 1 || 1)) * innerWidth;
    const y =
      padding +
      (1 - (point.value - min) / (max - min || 1)) * innerHeight;

    return {
      x,
      y,
      value: point.value,
      date: point.date,
    };
  });

  const linePoints = pointsArray.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPoints = [
    linePoints,
    `${pointsArray[pointsArray.length - 1].x},${height - padding}`,
    `${pointsArray[0].x},${height - padding}`,
  ].join(" ");

  return {
    linePoints,
    areaPoints,
    pointsArray,
  };
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function Sparkline({ data = [], label, currentValue, delta }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const width = 96;
  const height = 46;

  const { linePoints, areaPoints, pointsArray } = useMemo(
    () => buildSparkPoints(data, width, height, 3),
    [data]
  );

  function handleMouseMove(e) {
    if (!pointsArray.length) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const nearestIndex = pointsArray.reduce((bestIndex, point, i) => {
      const bestDistance = Math.abs(pointsArray[bestIndex].x - mouseX);
      const currentDistance = Math.abs(point.x - mouseX);
      return currentDistance < bestDistance ? i : bestIndex;
    }, 0);

    setHoverIndex(nearestIndex);
  }

  function handleMouseLeave() {
    setHoverIndex(null);
  }

  const hoveredPoint =
    hoverIndex !== null ? pointsArray[hoverIndex] : null;

  const lastPoint =
    pointsArray.length > 0 ? pointsArray[pointsArray.length - 1] : null;

  return (
    <div
      className="spark-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg className="spark" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`sparkGradient-${label.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(35,57,61,0.12)" />
            <stop offset="100%" stopColor="rgba(35,57,61,0.04)" />
          </linearGradient>
        </defs>

        {areaPoints && (
          <polygon
            className="spark-area"
            points={areaPoints}
            fill={`url(#sparkGradient-${label.replace(/\s+/g, "")})`}
          />
        )}

        {linePoints && (
          <polyline
            className="spark-line spark-line-animated"
            points={linePoints}
          />
        )}

        {hoveredPoint && (
          <>
            <line
              x1={hoveredPoint.x}
              y1="0"
              x2={hoveredPoint.x}
              y2={height}
              stroke="#bfc7c9"
              strokeDasharray="3 3"
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="3"
              fill="#23393d"
            />
          </>
        )}

        {!hoveredPoint && lastPoint && (
          <circle
            className="spark-dot"
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="2.5"
          />
        )}

        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="transparent"
        />
      </svg>

      {hoveredPoint && (
        <div className="spark-tooltip">
          <div className="chart-tooltip-date">
            {label} · {formatDateLabel(hoveredPoint.date)}
          </div>
          <div>Point: {Math.round(hoveredPoint.value).toLocaleString()}</div>
          <div>Current: {currentValue}</div>
          <div>Delta: {delta}</div>
        </div>
      )}
    </div>
  );
}