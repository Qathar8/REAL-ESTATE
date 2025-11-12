import { NavLink } from "react-router-dom";
import clsx from "classnames";

const adminNavItems = [
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/properties", label: "Properties" },
  { to: "/admin/site-visits", label: "Site Visits" },
  { to: "/admin/virtual-tours", label: "Virtual Tours" },
  { to: "/admin/receipts", label: "Receipts" }
];

export const AdminSidebar = () => {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white p-4 lg:flex">
      <div className="flex w-full flex-col gap-3">
        <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Dashboard
        </h2>
        <nav className="flex flex-1 flex-col gap-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-700",
                  isActive
                    ? "bg-brand-100 text-brand-800"
                    : "text-slate-600"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

