import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { release } from "../../data/sampleData";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const layoutClass = [
    "layout",
    navOpen ? "layout--nav-open" : "",
    collapsed ? "layout--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClass}>
      <button
        type="button"
        className="layout__backdrop"
        aria-label="Close navigation"
        onClick={() => setNavOpen(false)}
      />
      <Sidebar onNavigate={() => setNavOpen(false)} />
      <div className="layout__main">
        <Header
          onMenu={() => setNavOpen(true)}
          collapsed={collapsed}
          onCollapse={() => setCollapsed((value) => !value)}
        />
        <main className="layout__content">
          <Outlet />
        </main>
        <footer className="layout__footer">
          Meridian QA · {release.name} {release.theme} · Refreshed {release.refreshed}
        </footer>
      </div>
    </div>
  );
}
