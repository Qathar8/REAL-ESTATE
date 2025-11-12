import { InquiryForm, type InquiryFormValues } from "@/components/forms/InquiryForm";
import { useCreateClient, useUpdateClient } from "@/features/clients/hooks";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export const ContactPage = () => {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const handleSubmit = async (values: InquiryFormValues) => {
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
            notes: `Inquiry interest: ${values.propertyType}. Message: ${values.message}`
          }
        });
      } else {
        await createClient.mutateAsync({
          name: values.name,
          email: values.email,
          phone: values.phone,
          notes: `Inquiry interest: ${values.propertyType}. Message: ${values.message}`
        });
      }
      toast.success("Inquiry sent! We will contact you soon.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send inquiry. Please try again.");
    }
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row lg:items-start lg:px-0">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase text-brand-700">
            Contact Us
          </span>
          <h1 className="text-3xl font-semibold text-slate-900">
            Let&apos;s plan your property visit
          </h1>
          <p className="text-sm text-slate-600">
            Our team combines local expertise with data-driven insights to help
            you make confident real estate decisions.
          </p>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">Head Office</h3>
            <p className="mt-2 text-sm text-slate-500">
              123 Dream Avenue, Business Bay, Dubai, UAE
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>
                <span className="font-semibold text-slate-700">
                  Phone:
                </span>{" "}
                +971 55 123 4567
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span>{" "}
                hello@realestateerp.com
              </p>
              <p>
                <span className="font-semibold text-slate-700">Hours:</span> Mon
                - Sat, 9:00 AM - 7:00 PM GST
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <InquiryForm
            onSubmit={handleSubmit}
            isSubmitting={createClient.isPending || updateClient.isPending}
          />
        </div>
      </div>
    </div>
  );
};

