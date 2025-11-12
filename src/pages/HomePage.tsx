import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useProperties } from "@/features/properties/hooks";
import { InquiryForm, type InquiryFormValues } from "@/components/forms/InquiryForm";
import { FeaturedProperties } from "@/components/property/FeaturedProperties";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useCreateClient, useUpdateClient } from "@/features/clients/hooks";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  { value: "Plot", label: "Plots" },
  { value: "House", label: "Houses" },
  { value: "Property", label: "Properties" }
];

export const HomePage = () => {
  const [category, setCategory] = useState<string>("Property");
  const { data: properties = [], isLoading } = useProperties();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const filtered = useMemo(
    () =>
      properties
        .filter((property) => property.category === category)
        .slice(0, 3),
    [category, properties]
  );

  const handleInquirySubmit = async (values: InquiryFormValues) => {
    try {
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", values.email)
        .maybeSingle();

      if (existing?.id) {
        await updateClient.mutateAsync({
          id: existing.id,
          payload: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            notes: `Interested in ${values.propertyType}. Message: ${values.message}`
          }
        });
      } else {
        await createClient.mutateAsync({
          name: values.name,
          email: values.email,
          phone: values.phone,
          notes: `Interested in ${values.propertyType}. Message: ${values.message}`
        });
      }
      toast.success("Thank you! We will contact you shortly.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to submit inquiry. Please try again.");
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 lg:flex-row lg:items-center lg:px-0">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase text-brand-700">
              Trusted Real Estate ERP
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Find Your Dream Home with Seamless Site Visits & Virtual Tours
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Explore premium plots, luxury villas, and commercial properties.
              Book site visits, experience immersive virtual tours, and manage
              every step with our integrated ERP platform.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                Browse Properties
              </Link>
              <Link
                to="/properties?virtualTour=true"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-600 hover:text-brand-600"
              >
                Experience Virtual Tour
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">
                Search Properties
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Discover properties tailored to your preferences.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategory(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === option.value
                        ? "bg-brand-600 text-white shadow-soft"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                  </div>
                ) : (
                  <PropertyGrid
                    properties={filtered}
                    emptyMessage="No properties found for this category yet."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FeaturedProperties />
      <section
        id="contact"
        className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-20"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(45,135,255,0.4),_transparent_60%)]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 text-white lg:flex-row lg:items-start lg:px-0">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100">
              Connect with us
            </span>
            <h2 className="text-3xl font-semibold">
              Schedule a site visit or request a custom property tour
            </h2>
            <p className="text-slate-200">
              Complete the form and our property experts will curate the best
              options for you. We respond within 24 hours.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Office</h3>
                <p className="text-slate-300">
                  123 Dream Avenue, Business Bay, Dubai, UAE
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contact</h3>
                <p className="text-slate-300">+971 55 123 4567</p>
                <p className="text-slate-300">hello@realestateerp.com</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <InquiryForm
              onSubmit={handleInquirySubmit}
              isSubmitting={createClient.isPending || updateClient.isPending}
            />
          </div>
        </div>
      </section>
    </>
  );
};

