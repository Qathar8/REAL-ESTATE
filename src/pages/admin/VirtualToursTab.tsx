import { useState } from "react";
import toast from "react-hot-toast";

import {
  useCreateVirtualTour,
  useDeleteVirtualTour,
  useUpdateVirtualTour,
  useVirtualTours
} from "@/features/virtualTours/hooks";
import { useProperties } from "@/features/properties/hooks";
import { VirtualTourForm } from "@/components/forms/VirtualTourForm";
import type { VirtualTour } from "@/types";
import { uploadFileToStorage } from "@/lib/storage";

export const VirtualToursTab = () => {
  const { data: properties = [] } = useProperties();
  const {
    data: tours = [],
    isLoading,
    isError,
    error
  } = useVirtualTours();
  const createTour = useCreateVirtualTour();
  const updateTour = useUpdateVirtualTour();
  const deleteTour = useDeleteVirtualTour();
  const [editingTour, setEditingTour] = useState<VirtualTour | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: {
    property_id: string;
    title: string;
    tour_url: string;
    file?: File;
  }) => {
    try {
      let assetPath: string | undefined;
      if (values.file) {
        setUploading(true);
        const upload = await uploadFileToStorage(
          "virtual-tours",
          values.file,
          `${values.property_id}/`
        );
        assetPath = upload.publicUrl;
      }

      if (editingTour) {
        await updateTour.mutateAsync({
          id: editingTour.id,
          payload: {
            property_id: values.property_id,
            title: values.title,
            tour_url: values.tour_url,
            asset_path: assetPath ?? editingTour.asset_path
          }
        });
        toast.success("Virtual tour updated.");
      } else {
        await createTour.mutateAsync({
          property_id: values.property_id,
          title: values.title,
          tour_url: values.tour_url,
          asset_path: assetPath
        });
        toast.success("Virtual tour created.");
      }
      setEditingTour(null);
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to save virtual tour.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm("Delete this virtual tour?")) return;
    try {
      await deleteTour.mutateAsync(tourId);
      toast.success("Virtual tour deleted.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Failed to delete virtual tour.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingTour ? "Update Virtual Tour" : "Add Virtual Tour"}
            </h2>
            <p className="text-sm text-slate-500">
              Upload 360° media or link to third-party virtual experiences.
            </p>
          </div>
          {editingTour && (
            <button
              type="button"
              onClick={() => setEditingTour(null)}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-6">
          <VirtualTourForm
            properties={properties}
            defaultValues={editingTour ?? undefined}
            onSubmit={handleSubmit}
            isSubmitting={
              createTour.isPending || updateTour.isPending || uploading
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Virtual Tour Library
            </h2>
            <p className="text-sm text-slate-500">
              Manage immersive experiences linked to each property.
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        )}
        {isError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load virtual tours: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">
            {tours.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No virtual tours uploaded yet. Add one using the form above.
              </div>
            )}
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {tour.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Property: {tour.property?.name ?? "Removed"}
                  </p>
                  <a
                    href={tour.tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs font-semibold text-brand-600 hover:underline"
                  >
                    Open tour link
                  </a>
                  {tour.asset_path && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      Asset: {tour.asset_path.split("/").pop()}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditingTour(tour)}
                    className="text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tour.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

