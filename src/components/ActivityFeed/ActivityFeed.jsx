import StatusBadge from "../StatusBadge/StatusBadge";
import "./ActivityFeed.css";

export default function ActivityFeed({ items }) {
  if (!items.length) {
    return <p className="empty-note">No recent activity matches this filter.</p>;
  }

  return (
    <ol className="activity-feed">
      {items.map((item) => (
        <li key={item.id}>
          <span className={`activity-feed__dot activity-feed__dot--${item.result.toLowerCase().replace(/\s+/g, "-")}`} />
          <div>
            <p>
              <strong>{item.actor}</strong> {item.action} <span>{item.target}</span>
            </p>
            <div className="activity-feed__meta">
              <span>{item.time}</span>
              <span>{item.module}</span>
              <StatusBadge status={item.result} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
