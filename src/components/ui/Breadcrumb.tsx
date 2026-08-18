import { Link } from "react-router";
import { IoChevronForward } from "react-icons/io5";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] font-medium animate-fade-up" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <IoChevronForward size={12} style={{ color: "var(--text-muted)" }} />}
          {item.href ? (
            <Link
              to={item.href}
              className="transition-colors duration-200 hover:underline"
              style={{ color: "var(--accent-aqua)" }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}