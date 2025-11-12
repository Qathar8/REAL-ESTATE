import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-xl space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase text-brand-700">
          404
        </span>
        <h1 className="text-4xl font-semibold text-slate-900">
          Oops! We can’t find that page.
        </h1>
        <p className="text-sm text-slate-500">
          The page you are looking for may have been moved or no longer exists.
          Try returning to the homepage or explore our properties.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Back to home
          </Link>
          <Link
            to="/properties"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-600"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </div>
  );
};

