import InfoTooltip from "./InfoTooltip";
import Sparkline from "./Sparkline";

export default function KPICard({
  label,
  value,
  delta,
  tooltip,
  sparkData,
}) {
  return (
    <div className="panel kpi-panel">
      <div className="kpi">
        <div>
          <div className="kpi-label-row">
            <div className="kpi-label">{label}</div>
            <InfoTooltip text={tooltip} />
          </div>

          <div className="kpi-value">{value}</div>
          <div className="kpi-delta">{delta}</div>
        </div>

        <Sparkline
          data={sparkData}
          label={label}
          currentValue={value}
          delta={delta}
        />
      </div>
    </div>
  );
}