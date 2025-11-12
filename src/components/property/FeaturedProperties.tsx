import { Link } from "react-router-dom";

import { useFeaturedProperties } from "@/features/properties/hooks";
import { PropertyGrid } from "./PropertyGrid";

export const FeaturedProperties = () => {
  const { data, isLoading, isError, error } = useFeaturedProperties();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
        Unable to load featured properties: {error.message}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-0">
      <div className="flex flex-col items-start gap-4 pb-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">
            Featured Properties
          </h2>
          <p className="mt-2 max-w-xl text-slate-500">
            Handpicked homes and plots curated for the best investment and
            living experiences.
          </p>
        </div>
        <Link
          to="/properties"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-600"
        >
          View all properties
        </Link>
      </div>
      <PropertyGrid properties={data ?? []} emptyMessage="No featured properties yet." />
    </section>
  );
};

