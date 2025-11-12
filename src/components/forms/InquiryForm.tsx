import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ✅ Validation schema
const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  propertyType: z.enum(["Plot", "House", "Property"]),
  message: z.string().min(10, "Tell us about your requirements"),
});

// ✅ Type inference from schema
export type InquiryFormValues = z.infer<typeof inquirySchema>;

type InquiryFormProps = {
  onSubmit: (values: InquiryFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

// ✅ Form component
export const InquiryForm = ({ onSubmit, isSubmitting }: InquiryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      propertyType: "Property",
    },
  });

  return (
    <form
      className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h3 className="text-xl font-semibold text-slate-900">Book a Site Visit</h3>
      <p className="text-sm text-slate-500">
        Share your details and our team will reach out to schedule a site visit
        or virtual tour.
      </p>

      {/* --- Name & Email --- */}
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

      {/* --- Phone & Property Type --- */}
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
            Interested In
          </label>
          <select
            {...register("propertyType")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="Plot">Plots</option>
            <option value="House">Houses</option>
            <option value="Property">Commercial Properties</option>
          </select>
        </div>
      </div>

      {/* --- Message --- */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Tell us more
        </label>
        <textarea
          rows={4}
          {...register("message")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Preferred budget, locations, number of bedrooms, etc."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* --- Submit --- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
};
