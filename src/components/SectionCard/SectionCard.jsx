import "./SectionCard.css";

export default function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`section-card ${className}`.trim()}>
      {(title || action) && (
        <header className="section-card__header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="section-card__body">{children}</div>
    </section>
  );
}
