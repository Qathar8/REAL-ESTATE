import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useProperties } from "@/features/properties/hooks";

const filters = ["All", "Plot", "House", "Property"] as const;

export const PropertiesPage = () => {
  const { data = [], isLoading, isError, error } = useProperties();
  const [searchParams] = useSearchParams();
  const fromQuery = searchParams.get("category") as
    | "Plot"
    | "House"
    | "Property"
    | null;
  const [selectedFilter, setSelectedFilter] = useState<
    (typeof filters)[number]
  >(fromQuery ?? "All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((property) => {
      const matchesFilter =
        selectedFilter === "All" || property.category === selectedFilter;
      const matchesSearch =
        !search ||
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.location?.toLowerCase().includes(search.toLowerCase()) ||
        property.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [data, search, selectedFilter]);

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-0">
        <header className="flex flex-col gap-4 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Property Listings
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Explore Plots, Villas, and Premium Properties
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Filter by property type, search for locations, and book site visits
              instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex gap-2 rounded-full border border-slate-200 bg-white p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedFilter === filter
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  {filter === "Property" ? "Commercial" : filter}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or location"
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </header>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        )}
        {isError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            Unable to load properties: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <PropertyGrid
            properties={filtered}
            emptyMessage="No properties match your filters yet."
          />
        )}
      </div>
    </div>
  );
};

