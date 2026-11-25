import "./ChartTooltip.css";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  if (!label) {
    const entry = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__title">{entry.name}</p>
        <p><strong>{entry.value}</strong></p>
      </div>
    );
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{label}</p>
      {payload.map((entry) => (
        <p key={`${entry.dataKey}`}>
          <i style={{ background: entry.color }} />
          <span>{entry.name}</span>
          <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}
