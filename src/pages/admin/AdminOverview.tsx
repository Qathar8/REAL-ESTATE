import { useClients } from "@/features/clients/hooks";
import { useProperties } from "@/features/properties/hooks";
import { useSiteVisits } from "@/features/siteVisits/hooks";
import { useVirtualTours } from "@/features/virtualTours/hooks";

export const AdminOverview = () => {
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: properties = [], isLoading: loadingProperties } = useProperties();
  const { data: siteVisits = [], isLoading: loadingVisits } = useSiteVisits();
  const { data: virtualTours = [], isLoading: loadingTours } = useVirtualTours();

  const cards = [
    {
      label: "Active Clients",
      value: clients.length,
      loading: loadingClients,
      helper: "Managed under client CRM"
    },
    {
      label: "Properties Listed",
      value: properties.length,
      loading: loadingProperties,
      helper: "Live in the public catalog"
    },
    {
      label: "Upcoming Site Visits",
      value: siteVisits.filter((visit) => visit.status === "upcoming").length,
      loading: loadingVisits,
      helper: "Scheduled with clients"
    },
    {
      label: "Virtual Tours",
      value: virtualTours.length,
      loading: loadingTours,
      helper: "Immersive experiences ready"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            ERP Dashboard Overview
          </h2>
          <p className="text-sm text-slate-500">
            Monitor key metrics across your sales pipeline, property inventory, and client engagements.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              {card.loading ? (
                <div className="mt-4 h-8 w-16 animate-pulse rounded-full bg-slate-200" />
              ) : (
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {card.value}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">{card.helper}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

