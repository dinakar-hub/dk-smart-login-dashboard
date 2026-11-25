import { Link } from "react-router-dom";
import "./StatCard.css";

export default function StatCard({ label, value, meta, icon: Icon, tone, to }) {
  return (
    <Link to={to} className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon" aria-hidden="true">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>
      <strong className="stat-card__value">{value}</strong>
      <span className="stat-card__meta">{meta}</span>
    </Link>
  );
}
