import toast from "react-hot-toast";

import { ReceiptForm, type ReceiptFormValues } from "@/components/forms/ReceiptForm";
import { useClients } from "@/features/clients/hooks";
import {
  useCreateReceipt,
  useDeleteReceipt,
  useReceipts
} from "@/features/receipts/hooks";
import { useProperties } from "@/features/properties/hooks";
import { uploadFileToStorage } from "@/lib/storage";
import { generateReceiptPdf } from "@/lib/receipts";

export const ReceiptsTab = () => {
  const { data: clients = [] } = useClients();
  const { data: properties = [] } = useProperties();
  const {
    data: receipts = [],
    isLoading,
    isError,
    error
  } = useReceipts();
  const createReceipt = useCreateReceipt();
  const deleteReceipt = useDeleteReceipt();

  const handleSubmit = async (values: ReceiptFormValues) => {
    const client = clients.find((c) => c.id === values.client_id);
    const property = properties.find((p) => p.id === values.property_id);
    if (!client || !property) {
      toast.error("Client or property could not be found.");
      return;
    }
    try {
      const receiptNumber = crypto.randomUUID().slice(0, 8).toUpperCase();
      const { blob, fileName } = await generateReceiptPdf({
        companyName: values.companyName,
        companyAddress: values.companyAddress,
        logoUrl: values.logoUrl,
        client,
        property,
        amount: values.amount,
        issuedAt: values.issued_at,
        receiptNumber
      });
      const file = new File([blob], fileName, { type: "application/pdf" });
      const upload = await uploadFileToStorage(
        "receipts",
        file,
        `${client.id}/`
      );
      await createReceipt.mutateAsync({
        client_id: client.id,
        property_id: property.id,
        amount: values.amount,
        issued_at: values.issued_at,
        receipt_url: upload.publicUrl
      });
      toast.success("Receipt generated and stored.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Failed to generate receipt.");
    }
  };

  const handleDelete = async (receiptId: string) => {
    if (!confirm("Delete this receipt record?")) return;
    try {
      await deleteReceipt.mutateAsync(receiptId);
      toast.success("Receipt deleted.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to delete receipt.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Generate Receipt
          </h2>
          <p className="text-sm text-slate-500">
            Create branded PDF receipts and store them securely in Supabase.
          </p>
        </div>
        <div className="mt-6">
          <ReceiptForm
            clients={clients}
            properties={properties}
            onSubmit={handleSubmit}
            isSubmitting={createReceipt.isPending}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Receipt History
            </h2>
            <p className="text-sm text-slate-500">
              Download receipts, verify payments, and manage records.
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
            Failed to load receipts: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {receipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">
                        {receipt.client?.name ?? "Client removed"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {receipt.client?.email}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {receipt.property?.name ?? "Property removed"}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-brand-700">
                      ${receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {new Date(receipt.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 text-xs font-semibold">
                        <a
                          href={receipt.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:underline"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(receipt.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {receipts.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500">
                No receipts generated yet. Create one using the form above.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

