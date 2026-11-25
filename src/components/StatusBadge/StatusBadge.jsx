import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  const tone = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`badge badge--${tone}`}>{status}</span>;
}
