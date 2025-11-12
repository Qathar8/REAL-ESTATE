import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  purchaseHistory: z.string().optional(),
  notes: z.string().optional()
});

export type ClientFormValues = z.infer<typeof clientSchema>;

type ClientFormProps = {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const ClientForm = ({
  defaultValues,
  onSubmit,
  isSubmitting
}: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="+1 555 0100"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Purchase History / Preferences
        </label>
        <textarea
          {...register("purchaseHistory")}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Preferred property types, budget, etc."
        />
        {errors.purchaseHistory && (
          <p className="mt-1 text-xs text-red-600">
            {errors.purchaseHistory.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Additional Notes
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Any specific requirements?"
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Saving..." : "Save Client"}
      </button>
    </form>
  );
};

