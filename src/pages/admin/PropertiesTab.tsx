import { useState } from "react";
import toast from "react-hot-toast";

import {
  useCreateProperty,
  useDeleteProperty,
  useProperties,
  useUpdateProperty
} from "@/features/properties/hooks";
import type { Property } from "@/types";
import {
  PropertyForm,
  type PropertyFormValues
} from "@/components/forms/PropertyForm";

export const PropertiesTab = () => {
  const { data = [], isLoading, isError, error } = useProperties();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleSubmit = async (values: PropertyFormValues) => {
    try {
      if (editingProperty) {
        await updateProperty.mutateAsync({
          id: editingProperty.id,
          payload: values
        });
        toast.success("Property updated.");
      } else {
        await createProperty.mutateAsync(values);
        toast.success("Property created.");
      }
      setEditingProperty(null);
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to save property.");
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    try {
      await deleteProperty.mutateAsync(propertyId);
      toast.success("Property deleted.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Failed to delete property.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingProperty ? "Update Property" : "Add Property"}
            </h2>
            <p className="text-sm text-slate-500">
              Capture details, add images, and connect virtual tours.
            </p>
          </div>
          {editingProperty && (
            <button
              type="button"
              onClick={() => setEditingProperty(null)}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-6">
          <PropertyForm
            defaultValues={editingProperty ?? undefined}
            onSubmit={handleSubmit}
            isSubmitting={
              createProperty.isPending || updateProperty.isPending
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Property Inventory
            </h2>
            <p className="text-sm text-slate-500">
              Manage listings, highlight featured properties, and keep pricing in sync.
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
            Failed to load properties: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((property) => (
              <div
                key={property.id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-48 overflow-hidden rounded-t-3xl">
                  <img
                    src={
                      property.images?.[0] ??
                      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 px-5 py-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                        {property.category}
                      </p>
                      {property.isFeatured && (
                        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {property.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {property.location ?? "Location TBD"}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-brand-700">
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {property.shortDescription ??
                      "No short description provided yet."}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setEditingProperty(property)}
                      className="text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(property.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isError && data.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No properties available yet. Add your first property using the form above.
          </div>
        )}
      </section>
    </div>
  );
};

