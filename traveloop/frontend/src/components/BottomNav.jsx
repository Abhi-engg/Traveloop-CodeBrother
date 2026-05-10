import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Trips", path: "/trips", icon: "✈️" },
  { label: "Explore", path: "/search/cities", icon: "🌍" },
  { label: "Budget", path: "/budget", icon: "💰" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-white/90 backdrop-blur"
      id="bottom-nav"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              id={`nav-${item.label.toLowerCase()}`}
              className="flex flex-col items-center gap-1 text-xs uppercase tracking-[0.15em]"
              style={{
                textDecoration: "none",
                color: isActive ? "var(--coral)" : "var(--slate)",
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.2s ease",
              }}
            >
              <span style={{ fontSize: "1.15rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
