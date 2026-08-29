import { Link } from "react-router";
import { IoChevronForward } from "react-icons/io5";
import type { BreadcrumbItem } from "@/types";

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs font-medium animate-fade-up"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <IoChevronForward
              size={12}
              className="text-fg-muted"
            />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="transition-colors duration-200 hover:underline text-accent"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-fg-dim">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
