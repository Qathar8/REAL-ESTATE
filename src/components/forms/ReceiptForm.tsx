import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Client, Property } from "@/types";

const receiptSchema = z.object({
  client_id: z.string().min(1, "Select a client"),
  property_id: z.string().min(1, "Select a property"),
  amount: z
    .number({
      invalid_type_error: "Amount must be a number"
    })
    .positive("Amount must be greater than zero"),
  issued_at: z.string().min(1, "Choose a date"),
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().optional(),
  logoUrl: z.string().url("Enter a valid URL").optional()
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;

type ReceiptFormProps = {
  clients: Client[];
  properties: Property[];
  defaultValues?: Partial<ReceiptFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: ReceiptFormValues) => void | Promise<void>;
};

export const ReceiptForm = ({
  clients,
  properties,
  defaultValues,
  isSubmitting,
  onSubmit
}: ReceiptFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Client</label>
          <select
            {...register("client_id")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            defaultValue=""
          >
            <option value="" disabled>
              Select client
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
            Property
          </label>
          <select
            {...register("property_id")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            defaultValue=""
          >
            <option value="" disabled>
              Select property
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
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Amount Paid
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Receipt Date
          </label>
          <input
            type="date"
            {...register("issued_at")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.issued_at && (
            <p className="mt-1 text-xs text-red-600">
              {errors.issued_at.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Company Name
          </label>
          <input
            type="text"
            {...register("companyName")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Company Address
          </label>
          <input
            type="text"
            {...register("companyAddress")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Company Logo URL (optional)
        </label>
        <input
          type="url"
          {...register("logoUrl")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="https://example.com/logo.png"
        />
        {errors.logoUrl && (
          <p className="mt-1 text-xs text-red-600">{errors.logoUrl.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Generating..." : "Generate Receipt"}
      </button>
    </form>
  );
};

