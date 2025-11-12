import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Property, PropertyCategory } from "@/types";

const propertySchema = z.object({
  name: z.string().min(3, "Name is required"),
  category: z.enum(["Plot", "House", "Property"]),
  price: z
    .number({
      invalid_type_error: "Price must be a number"
    })
    .nonnegative("Price must be positive"),
  location: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  images: z.array(z.string()).optional(),
  virtualTourUrl: z.string().url("Enter a valid URL").optional(),
  isFeatured: z.boolean().optional()
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

type PropertyFormProps = {
  defaultValues?: Property;
  onSubmit: (values: PropertyFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const categories: PropertyCategory[] = ["Plot", "House", "Property"];

export const PropertyForm = ({
  defaultValues,
  onSubmit,
  isSubmitting
}: PropertyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          category: defaultValues.category,
          price: defaultValues.price,
          location: defaultValues.location ?? "",
          description: defaultValues.description ?? "",
          shortDescription: defaultValues.shortDescription ?? "",
          images: defaultValues.images ?? [],
          virtualTourUrl: defaultValues.virtualTourUrl ?? "",
          isFeatured: Boolean(defaultValues.isFeatured)
        }
      : {
          category: "Property",
          price: 0,
          images: [],
          isFeatured: false
        }
  });

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const list = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setValue("images", list);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Property Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            {...register("category")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            type="text"
            {...register("location")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Short Description
        </label>
        <textarea
          rows={2}
          {...register("shortDescription")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Full Description
        </label>
        <textarea
          rows={4}
          {...register("description")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Image URLs (comma separated)
        </label>
        <input
          type="text"
          defaultValue={defaultValues?.images?.join(", ") ?? ""}
          onChange={handleTagsChange}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="https://example.com/image-1.jpg, https://example.com/image-2.jpg"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Virtual Tour URL
        </label>
        <input
          type="url"
          {...register("virtualTourUrl")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="https://example.com/virtual-tour"
        />
        {errors.virtualTourUrl && (
          <p className="mt-1 text-xs text-red-500">
            {errors.virtualTourUrl.message}
          </p>
        )}
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" {...register("isFeatured")} className="h-4 w-4" />
        Mark as featured property
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isSubmitting ? "Saving..." : "Save Property"}
      </button>
    </form>
  );
};

