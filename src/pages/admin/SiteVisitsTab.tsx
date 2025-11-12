import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { SiteVisitForm } from "@/components/forms/SiteVisitForm";
import { useClients } from "@/features/clients/hooks";
import {
  useCreateSiteVisit,
  useDeleteSiteVisit,
  useSiteVisits,
  useUpdateSiteVisit
} from "@/features/siteVisits/hooks";
import { useProperties } from "@/features/properties/hooks";
import type { SiteVisit } from "@/types";

export const SiteVisitsTab = () => {
  const { data: clients = [] } = useClients();
  const { data: properties = [] } = useProperties();
  const {
    data: visits = [],
    isLoading,
    isError,
    error
  } = useSiteVisits();
  const createSiteVisit = useCreateSiteVisit();
  const updateSiteVisit = useUpdateSiteVisit();
  const deleteSiteVisit = useDeleteSiteVisit();
  const [editingVisit, setEditingVisit] = useState<SiteVisit | null>(null);

  const groupedVisits = useMemo(() => {
    const upcoming = visits.filter((visit) => visit.status === "upcoming");
    const completed = visits.filter((visit) => visit.status === "completed");
    const cancelled = visits.filter((visit) => visit.status === "cancelled");
    return { upcoming, completed, cancelled };
  }, [visits]);

  const handleSubmit = async (values: {
    client_id: string;
    property_id: string;
    scheduled_date: string;
    status: "upcoming" | "completed" | "cancelled";
    notes?: string;
  }) => {
    try {
      if (editingVisit) {
        await updateSiteVisit.mutateAsync({
          id: editingVisit.id,
          payload: values
        });
        toast.success("Site visit updated.");
      } else {
        await createSiteVisit.mutateAsync(values);
        toast.success("Site visit scheduled.");
      }
      setEditingVisit(null);
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to save site visit.");
    }
  };

  const handleDelete = async (visitId: string) => {
    if (!confirm("Delete this site visit?")) return;
    try {
      await deleteSiteVisit.mutateAsync(visitId);
      toast.success("Site visit deleted.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Failed to delete site visit.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingVisit ? "Update Site Visit" : "Schedule Site Visit"}
            </h2>
            <p className="text-sm text-slate-500">
              Assign clients to properties, manage time slots, and track visit status.
            </p>
          </div>
          {editingVisit && (
            <button
              type="button"
              onClick={() => setEditingVisit(null)}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-6">
          <SiteVisitForm
            clients={clients}
            properties={properties}
            defaultValues={
              editingVisit
                ? {
                    ...editingVisit,
                    notes: editingVisit.notes ?? ""
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={
              createSiteVisit.isPending || updateSiteVisit.isPending
            }
          />
        </div>
      </section>

      <section className="space-y-8">
        {(["upcoming", "completed", "cancelled"] as const).map((status) => {
          const label =
            status === "upcoming"
              ? "Upcoming Visits"
              : status === "completed"
                ? "Completed Visits"
                : "Cancelled Visits";
          const list = groupedVisits[status];
          return (
            <div
              key={status}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {label}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {status === "upcoming"
                      ? "Coordinate logistics and reminders."
                      : status === "completed"
                        ? "Review notes and follow-ups."
                        : "Cancelled visits for records."}
                  </p>
                </div>
              </div>
              {isLoading && (
                <div className="flex justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                </div>
              )}
              {isError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Failed to load site visits: {error.message}
                </div>
              )}
              {!isLoading && !isError && (
                <div className="mt-6 space-y-4">
                  {list.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      No {status} site visits yet.
                    </div>
                  )}
                  {list.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {visit.property?.name ?? "Property removed"} with{" "}
                          {visit.client?.name ?? "Client removed"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(visit.scheduled_date).toLocaleString()}
                        </p>
                        {visit.notes && (
                          <p className="mt-1 text-xs text-slate-500">
                            Notes: {visit.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setEditingVisit(visit)}
                          className="text-brand-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(visit.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};

