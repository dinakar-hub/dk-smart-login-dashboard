import { useEffect, useRef, useState } from "react";
import { Bell, Menu, PanelLeft, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { findNavItem } from "../../data/navigation";
import { currentUser, notifications as seedNotifications, release } from "../../data/sampleData";
import { initials } from "../../utils/format";
import "./Header.css";

export default function Header({ onMenu, onCollapse, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const page = findNavItem(location.pathname);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState(seedNotifications);
  const [notesOpen, setNotesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notesRef = useRef(null);
  const profileRef = useRef(null);
  const unread = notes.filter((item) => item.unread).length;

  useEffect(() => {
    const onPointer = (event) => {
      if (!notesRef.current?.contains(event.target)) setNotesOpen(false);
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setNotesOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/test-management?q=${encodeURIComponent(value)}` : "/test-management");
  };

  const markAllRead = () => {
    setNotes((current) => current.map((item) => ({ ...item, unread: false })));
  };

  return (
    <header className="header">
      <div className="header__title">
        <button type="button" className="icon-btn header__menu" onClick={onMenu} aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <button
          type="button"
          className="icon-btn header__collapse"
          onClick={onCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft size={18} />
        </button>
        <div>
          <p className="header__eyebrow">{release.sprint} · {release.environment}</p>
          <h1>{page.label}</h1>
        </div>
      </div>

      <form className="header__search" onSubmit={onSearch}>
        <Search size={16} aria-hidden="true" />
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search test cases"
          aria-label="Search test cases"
        />
      </form>

      <div className="header__tools">
        <span className="release-pill">{release.name}</span>
        <div className="menu" ref={notesRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            aria-expanded={notesOpen}
            onClick={() => {
              setNotesOpen((open) => !open);
              setProfileOpen(false);
            }}
          >
            <Bell size={18} />
            {unread > 0 && <span className="icon-btn__badge">{unread}</span>}
          </button>
          {notesOpen && (
            <div className="dropdown dropdown--notes">
              <div className="dropdown__head">
                <strong>Notifications</strong>
                <button type="button" className="text-btn" onClick={markAllRead}>Mark all read</button>
              </div>
              <ul>
                {notes.map((item) => (
                  <li key={item.id} className={item.unread ? "is-unread" : ""}>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                    <span>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="menu" ref={profileRef}>
          <button
            type="button"
            className="profile-btn"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotesOpen(false);
            }}
          >
            <span className="avatar">{initials(currentUser.name)}</span>
            <span className="profile-btn__copy">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.role}</span>
            </span>
          </button>
          {profileOpen && (
            <div className="dropdown dropdown--profile">
              <p>{currentUser.team}</p>
              <p>Signed in for {release.name}</p>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
              >
                Workspace settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
