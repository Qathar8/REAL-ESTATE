import { useVirtualTours } from "@/features/virtualTours/hooks";
import { VirtualTourViewer } from "@/components/virtual-tour/VirtualTourViewer";

export const VirtualToursPage = () => {
  const { data = [], isLoading, isError, error } = useVirtualTours();

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl space-y-10 px-4 lg:px-0">
        <header>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase text-brand-700">
            Immersive Experiences
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Explore Properties Through Virtual Tours
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Dive into 360° walkthroughs and high-definition videos. Experience
            properties remotely or prepare for your next site visit.
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        )}
        {isError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            Unable to load virtual tours: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="grid gap-8">
            {data.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                Virtual tours will appear here once your team uploads them from
                the admin dashboard.
              </div>
            )}
            {data.map((tour) => (
              <div
                key={tour.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-3 pb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {tour.title}
                  </h2>
                  {tour.property && (
                    <p className="text-sm text-slate-500">
                      Linked property: <span className="font-semibold">{tour.property.name}</span>
                    </p>
                  )}
                </div>
                <VirtualTourViewer
                  title="360° Tour"
                  tourUrl={tour.tour_url}
                  assetUrl={tour.asset_path ?? undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

