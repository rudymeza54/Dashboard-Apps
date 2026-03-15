
console.log("API BASE:", import.meta.env.VITE_API_BASE);


const conversionData = [
  { label: "Ingested → Validated", rate: "99.3%" },
  { label: "Validated → Rules Applied", rate: "98.6%" },
  { label: "Rules Applied → Auto-Decided", rate: "96.7%" },
  { label: "Auto-Decided → Approved", rate: "93.9%" },
];

export default function ConversionRates() {
  return (
    <div className="panel">
      <div className="ptitle">Conversion Rates</div>

      {conversionData.map((item) => (
        <div className="conv-item" key={item.label}>
          <div>{item.label}</div>
          <div className="conv-rate">{item.rate}</div>
        </div>
      ))}
    </div>
  );
}