import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Client, Property, SiteVisit } from "@/types";

// ✅ Zod validation schema
const siteVisitSchema = z.object({
  client_id: z.string().min(1, "Select a client"),
  property_id: z.string().min(1, "Select a property"),
  scheduled_date: z.string().min(1, "Choose a date and time"),
  status: z.enum(["upcoming", "completed", "cancelled"]),
  notes: z.string().optional(),
});

// ✅ Type inferred from schema
export type SiteVisitFormValues = z.infer<typeof siteVisitSchema>;

type SiteVisitFormProps = {
  clients: Client[];
  properties: Property[];
  defaultValues?: Partial<SiteVisitFormValues>; // ✅ was Partial<SiteVisit>
  onSubmit: (values: SiteVisitFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const SiteVisitForm = ({
  clients,
  properties,
  defaultValues,
  onSubmit,
  isSubmitting,
}: SiteVisitFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteVisitFormValues>({
    resolver: zodResolver(siteVisitSchema),
    defaultValues: defaultValues ?? {
      client_id: "",
      property_id: "",
      scheduled_date: "",
      status: "upcoming",
      notes: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* --- Client & Property Selectors --- */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Select Client
          </label>
          <select
            {...register("client_id")}
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="" disabled>
              Choose a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="mt-1 text-xs text-red-600">
              {errors.client_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Select Property
          </label>
          <select
            {...register("property_id")}
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="" disabled>
              Choose a property
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
      </div>

      {/* --- Schedule & Status --- */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Schedule Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("scheduled_date")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.scheduled_date && (
            <p className="mt-1 text-xs text-red-600">
              {errors.scheduled_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Visit Status
          </label>
          <select
            {...register("status")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* --- Notes --- */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Additional Notes
        </label>
        <textarea
          rows={3}
          {...register("notes")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {/* --- Submit Button --- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Saving..." : "Schedule Visit"}
      </button>
    </form>
  );
};
