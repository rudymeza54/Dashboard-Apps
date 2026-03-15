// src/components/InfoTooltip.jsx
export default function InfoTooltip({ text }) {
  return (
    <div className="tooltip-wrap">
      <span className="tooltip-icon">i</span>
      <div className="tooltip-box">{text}</div>
    </div>
  );
}