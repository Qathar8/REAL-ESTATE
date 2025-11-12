import type { Property } from "@/types";
import { PropertyCard } from "./PropertyCard";

type PropertyGridProps = {
  properties: Property[];
  emptyMessage?: string;
};

export const PropertyGrid = ({
  properties,
  emptyMessage = "No properties available."
}: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

