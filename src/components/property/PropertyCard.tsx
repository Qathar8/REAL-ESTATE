import { Link } from "react-router-dom";
import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";

import type { Property } from "@/types";

type PropertyCardProps = {
  property: Property;
};

const placeholder =
  "https://images.unsplash.com/photo-1505692968213-5f83b6b78180?auto=format&fit=crop&w=1000&q=80";

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const image = property.images?.[0] ?? placeholder;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={property.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-brand-700 shadow">
          {property.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow">
          ${property.price.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {property.name}
          </h3>
          {property.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPinIcon className="h-4 w-4" />
              {property.location}
            </p>
          )}
          {property.shortDescription && (
            <p className="mt-3 text-sm text-slate-500">
              {property.shortDescription}
            </p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-600"
          >
            View Details
          </Link>
          <Link
            to={`/properties/${property.id}#site-visit`}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Book Site Visit
          </Link>
          <Link
            to={`/properties/${property.id}#virtual-tour`}
            className="inline-flex items-center justify-center rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Virtual Tour
          </Link>
        </div>
        <Link
          to={`/properties/${property.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:gap-3"
        >
          Explore property <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

