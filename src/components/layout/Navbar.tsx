import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "classnames";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/contact", label: "Contact" },
  { to: "/virtual-tours", label: "Virtual Tours" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold text-brand-700"
        >
          <img
            src="/hub.jpeg"
            alt="Logo"
            className="h-10 w-auto object-contain rounded-md"
          />
          <span>Real Estate ERP</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "transition hover:text-brand-600",
                  isActive && "text-brand-600"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to="/properties"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Book Site Visit
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-4 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "rounded-md px-3 py-2 transition hover:bg-slate-100",
                    isActive && "text-brand-600"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/properties"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
            >
              Book Site Visit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
