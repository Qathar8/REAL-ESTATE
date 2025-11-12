import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Property, VirtualTour } from "@/types";

const virtualTourSchema = z.object({
  property_id: z.string().min(1, "Select a property"),
  title: z.string().min(3, "Title is required"),
  tour_url: z.string().url("Enter a valid virtual tour URL"),
  file: z
    .instanceof(File)
    .optional()
    .or(z.undefined())
});

export type VirtualTourFormValues = z.infer<typeof virtualTourSchema>;

type VirtualTourFormProps = {
  properties: Property[];
  defaultValues?: VirtualTour;
  onSubmit: (values: VirtualTourFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const VirtualTourForm = ({
  properties,
  defaultValues,
  onSubmit,
  isSubmitting
}: VirtualTourFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VirtualTourFormValues>({
    resolver: zodResolver(virtualTourSchema),
    defaultValues: defaultValues
      ? {
          property_id: defaultValues.property_id,
          title: defaultValues.title,
          tour_url: defaultValues.tour_url
        }
      : undefined
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Property
          </label>
          <select
            {...register("property_id")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            defaultValue=""
          >
            <option value="" disabled>
              Choose property
            </option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          {errors.property_id && (
            <p className="mt-1 text-xs text-red-600">
              {errors.property_id.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Virtual Tour URL
        </label>
        <input
          type="url"
          {...register("tour_url")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="https://example.com/virtual-tour"
        />
        {errors.tour_url && (
          <p className="mt-1 text-xs text-red-600">{errors.tour_url.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Upload 360° Asset (optional)
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          {...register("file")}
          className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-600 hover:file:bg-brand-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          Upload panoramic images or videos to host in Supabase Storage.
        </p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Saving..." : "Save Virtual Tour"}
      </button>
    </form>
  );
};

