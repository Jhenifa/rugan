import { Fragment } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({
  items = [],
  className = "",
  theme = "light",
  center = false,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const isDark = theme === "dark";
  const itemColor = isDark ? "rgba(255,255,255,0.78)" : "#6B7280";
  const currentColor = isDark ? "#FFFFFF" : "#111827";

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{ display: "flex", justifyContent: center ? "center" : "flex-start" }}
    >
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.4rem",
          margin: 0,
          padding: 0,
          listStyle: "none",
          color: itemColor,
          fontSize: "0.875rem",
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.path}-${item.name}`}>
              <li>
                {isLast ? (
                  <span aria-current="page" style={{ color: currentColor, fontWeight: 600 }}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    style={{ color: itemColor, textDecoration: "none" }}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <li aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
                  <ChevronRight size={14} />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
