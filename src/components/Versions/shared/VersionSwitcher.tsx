import { NavLink } from "react-router-dom";
import "./VersionSwitcher.scss";

const LINKS = [
  { to: "/v1", label: "V1", name: "Night Court" },
  { to: "/v2", label: "V2", name: "The Build" },
  { to: "/v3", label: "V3", name: "Living Court" },
  { to: "/", label: "Live", name: "Current site" },
];

export function VersionSwitcher({
  tone = "dark",
  placement = "bottom",
}: {
  tone?: "dark" | "light";
  placement?: "bottom" | "top";
}) {
  return (
    <nav className={`vs-switch vs-switch--${tone} vs-switch--${placement}`} aria-label="Design versions">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end
          className={({ isActive }) => `vs-switch__link${isActive ? " is-active" : ""}`}
          title={l.name}
        >
          <span className="vs-switch__label">{l.label}</span>
          <span className="vs-switch__name">{l.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
