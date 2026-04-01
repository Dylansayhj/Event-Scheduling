import { useState } from "react";
import { Link } from "react-router-dom";

const defaultLinks = [
  { label: "Events", to: "/events" },
];

export default function Navbar({
  logo = "Scheduling Event",
  links = defaultLinks,
  ctaLabel = "+ New Event",
  onCtaClick,
  ctaTo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logoParts = logo.split("·");

  const ctaClass =
    "bg-[#2d4a3e] hover:bg-[#3d6455] text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-px";

  const linkClass =
    "text-[#7a7268] hover:text-[#2d4a3e] text-sm font-medium no-underline transition-colors duration-200";

  return (
    <nav className="relative flex items-center justify-between px-12 py-6 bg-[#f7f3ee] border-b border-[#e8dfd3]">
      {/* Logo */}
      <Link to="/" className="font-serif text-xl font-bold text-[#2d4a3e] tracking-tight no-underline">
        {logoParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < logoParts.length - 1 && (
              <span className="text-[#b5956a]">·</span>
            )}
          </span>
        ))}
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.to} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          {ctaTo ? (
            <Link to={ctaTo} className={ctaClass}>
              {ctaLabel}
            </Link>
          ) : (
            <button className={ctaClass} onClick={onCtaClick}>
              {ctaLabel}
            </button>
          )}
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-1 text-[#2d4a3e]"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f7f3ee] border-b border-[#e8dfd3] px-12 py-6 flex flex-col gap-4 md:hidden z-50">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {ctaTo ? (
            <Link to={ctaTo} className={ctaClass + " text-center"} onClick={() => setMenuOpen(false)}>
              {ctaLabel}
            </Link>
          ) : (
            <button
              className={ctaClass}
              onClick={() => { onCtaClick?.(); setMenuOpen(false); }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

