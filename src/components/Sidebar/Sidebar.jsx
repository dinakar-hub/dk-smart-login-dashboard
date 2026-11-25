import { NavLink } from "react-router-dom";
import { navSections } from "../../data/navigation";
import { currentUser, release } from "../../data/sampleData";
import { initials } from "../../utils/format";
import "./Sidebar.css";

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand" onClick={onNavigate}>
        <span className="brand__mark" aria-hidden="true">M</span>
        <span className="brand__text">
          <strong>Meridian QA</strong>
          <span>Test management</span>
        </span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Primary">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="sidebar__section">{section.label}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  title={item.label}
                  onClick={onNavigate}
                  className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span className="sidebar__label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="avatar avatar--light" aria-hidden="true">
          {initials(currentUser.name)}
        </span>
        <span className="sidebar__footer-copy">
          <strong>{currentUser.name}</strong>
          <span>{release.environment} · {currentUser.role}</span>
        </span>
      </div>
    </aside>
  );
}
