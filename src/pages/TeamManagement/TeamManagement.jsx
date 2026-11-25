import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { team } from "../../data/sampleData";
import { initials } from "../../utils/format";
import "./TeamManagement.css";

const roles = ["All", ...new Set(team.map((member) => member.role))];

export default function TeamManagement() {
  const [role, setRole] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return team.filter((member) => {
      const matchesRole = role === "All" || member.role === role;
      const matchesQuery = !needle
        || member.name.toLowerCase().includes(needle)
        || member.focus.toLowerCase().includes(needle);
      return matchesRole && matchesQuery;
    });
  }, [role, query]);

  const caseLoad = visible.reduce((sum, member) => sum + member.cases, 0);

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Quality engineering"
        title="Team management"
        description="Sprint capacity for the squad covering Release 4.2. Availability reflects environment and review load today."
      />

      <div className="toolbar">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name or focus"
          aria-label="Search team"
        />
        <select className="select" value={role} aria-label="Role" onChange={(event) => setRole(event.target.value)}>
          {roles.map((item) => <option key={item}>{item}</option>)}
        </select>
        <span className="result-count">{visible.length} people · {caseLoad} assigned cases</span>
      </div>

      {visible.length === 0 ? (
        <p className="empty-note">No one matches that search.</p>
      ) : (
        <ul className="team-grid">
          {visible.map((member) => (
            <li key={member.id} className="member-card">
              <div className="member-card__head">
                <span className="avatar avatar--team">{initials(member.name)}</span>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.role}</p>
                </div>
              </div>
              <StatusBadge status={member.availability === "Blocked" ? "Blocked" : member.availability === "Reviewing" ? "In review" : "On sprint"} />
              <dl>
                <div><dt>Focus</dt><dd>{member.focus}</dd></div>
                <div><dt>Assigned cases</dt><dd>{member.cases}</dd></div>
                <div><dt>Open defects</dt><dd>{member.openDefects}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
