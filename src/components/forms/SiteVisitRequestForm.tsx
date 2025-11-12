import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const siteVisitRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Provide a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  scheduled_date: z.string().min(1, "Select date and time"),
  notes: z.string().optional()
});

export type SiteVisitRequestValues = z.infer<typeof siteVisitRequestSchema>;

type SiteVisitRequestFormProps = {
  onSubmit: (values: SiteVisitRequestValues) => void | Promise<void>;
  isSubmitting?: boolean;
  propertyName: string;
};

export const SiteVisitRequestForm = ({
  onSubmit,
  isSubmitting,
  propertyName
}: SiteVisitRequestFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SiteVisitRequestValues>({
    resolver: zodResolver(siteVisitRequestSchema)
  });

  return (
    <form
      className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
      onSubmit={handleSubmit(onSubmit)}
      id="site-visit"
      noValidate
    >
      <h3 className="text-xl font-semibold text-slate-900">
        Schedule a Visit for {propertyName}
      </h3>
      <p className="text-sm text-slate-500">
        Pick a date and time. Our team will confirm the visit or arrange a
        virtual tour for you.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <input
            type="text"
            {...register("name")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Preferred Date & Time
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
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Additional Notes
        </label>
        <textarea
          rows={3}
          {...register("notes")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Share any preferences or questions."
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Submitting..." : "Request Site Visit"}
      </button>
    </form>
  );
};

