import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useProperty } from "@/features/properties/hooks";
import { VirtualTourViewer } from "@/components/virtual-tour/VirtualTourViewer";
import { SiteVisitRequestForm } from "@/components/forms/SiteVisitRequestForm";
import { useCreateSiteVisit } from "@/features/siteVisits/hooks";
import { supabase } from "@/lib/supabaseClient";
import { useCreateClient } from "@/features/clients/hooks";

const placeholder =
  "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1000&q=80";

export const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useProperty(id);
  const createSiteVisit = useCreateSiteVisit();
  const createClient = useCreateClient();
  const [submitting, setSubmitting] = useState(false);

  const images = useMemo(() => {
    if (!data?.images || data.images.length === 0) {
      return [placeholder];
    }
    return data.images;
  }, [data?.images]);

  const handleSiteVisitRequest = async (values: {
    name: string;
    email: string;
    phone: string;
    scheduled_date: string;
    notes?: string;
  }) => {
    if (!data) return;
    setSubmitting(true);
    try {
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("email", values.email)
        .maybeSingle();

      let clientId = existingClient?.id;

      if (!clientId) {
        const newClient = await createClient.mutateAsync({
          name: values.name,
          email: values.email,
          phone: values.phone,
          notes: values.notes
        });
        clientId = newClient.id;
      }

      await createSiteVisit.mutateAsync({
        client_id: clientId,
        property_id: data.id,
        scheduled_date: values.scheduled_date,
        status: "upcoming",
        notes: values.notes
      });

      toast.success("We received your request. Our team will confirm shortly.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to schedule the site visit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-0">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error?.message ?? "Property not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4 lg:px-0">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase text-brand-700">
                {data.category}
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                {data.name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-brand-700">
                ${data.price.toLocaleString()}
              </p>
              {data.location && (
                <p className="mt-2 text-sm text-slate-500">
                  Located in {data.location}
                </p>
              )}
              {data.shortDescription && (
                <p className="mt-4 text-sm text-slate-600">
                  {data.shortDescription}
                </p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {images.map((image, index) => (
                <img
                  key={image + index}
                  src={image}
                  alt={`${data.name} view ${index + 1}`}
                  className="h-64 w-full rounded-3xl object-cover shadow-md"
                />
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">
                Property Overview
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {data.description ??
                  "Detailed description will be available soon. Contact our team for more information."}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Property Type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {data.category}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Listed On
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {data.created_at
                      ? new Date(data.created_at).toLocaleDateString()
                      : "Recently added"}
                  </p>
                </div>
              </div>
            </div>
            <VirtualTourViewer
              title="360° Virtual Tour"
              tourUrl={data.virtualTourUrl ?? undefined}
              assetUrl={data.virtualTourUrl?.includes("supabase")
                ? data.virtualTourUrl
                : undefined}
            />
          </div>
          <div className="flex flex-col gap-6">
            <SiteVisitRequestForm
              propertyName={data.name}
              onSubmit={handleSiteVisitRequest}
              isSubmitting={submitting}
            />
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 text-sm text-brand-900 shadow-lg">
              <h3 className="text-lg font-semibold">Need a Virtual Tour?</h3>
              <p className="mt-2">
                Request an immersive walk-through experience guided by our
                property consultant.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "site-visit";
                }}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                Request Virtual Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

