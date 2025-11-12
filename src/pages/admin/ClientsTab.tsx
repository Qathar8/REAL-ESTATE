import { useState } from "react";
import toast from "react-hot-toast";

import { ClientForm, type ClientFormValues } from "@/components/forms/ClientForm";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient
} from "@/features/clients/hooks";
import { uploadFileToStorage } from "@/lib/storage";
import type { Client } from "@/types";

export const ClientsTab = () => {
  const { data = [], isLoading, isError, error } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      if (editingClient) {
        await updateClient.mutateAsync({
          id: editingClient.id,
          payload: values
        });
        toast.success("Client updated successfully.");
      } else {
        await createClient.mutateAsync(values);
        toast.success("Client added successfully.");
      }
      setEditingClient(null);
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to save client. Please try again.");
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteClient.mutateAsync(clientId);
      toast.success("Client deleted.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Unable to delete client.");
    }
  };

  const handleDocumentUpload = async (
    client: Client,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    try {
      setUploadingFor(client.id);
      const uploads = await Promise.all(
        Array.from(files).map((file) =>
          uploadFileToStorage("client-documents", file, `${client.id}/`)
        )
      );
      const urls = uploads.map((upload) => upload.publicUrl);
      const updatedDocuments = [...(client.documents ?? []), ...urls];
      await updateClient.mutateAsync({
        id: client.id,
        payload: { documents: updatedDocuments }
      });
      toast.success("Documents uploaded successfully.");
    } catch (mutationError) {
      console.error(mutationError);
      toast.error("Failed to upload documents.");
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingClient ? "Update Client" : "Add New Client"}
            </h2>
            <p className="text-sm text-slate-500">
              Store client details, upload documents, and track purchase history.
            </p>
          </div>
          {editingClient && (
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-6">
          <ClientForm
            defaultValues={
              editingClient
                ? {
                    name: editingClient.name,
                    email: editingClient.email,
                    phone: editingClient.phone,
                    purchaseHistory: editingClient.purchaseHistory ?? "",
                    notes: editingClient.notes ?? ""
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={
              createClient.isPending || updateClient.isPending
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Clients Directory
            </h2>
            <p className="text-sm text-slate-500">
              Review client profiles, upload agreements, and manage contact details.
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
            Failed to load clients: {error.message}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Documents</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">
                        {client.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {client.purchaseHistory ?? "No purchase history yet"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-brand-600">
                          <input
                            type="file"
                            multiple
                            onChange={(event) =>
                              handleDocumentUpload(
                                client,
                                event.target.files
                              )
                            }
                            className="hidden"
                            disabled={uploadingFor === client.id}
                          />
                          <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1">
                            {uploadingFor === client.id
                              ? "Uploading..."
                              : "Upload"}
                          </span>
                        </label>
                        {(client.documents ?? []).length > 0 ? (
                          <ul className="space-y-1 text-xs text-slate-500">
                            {client.documents?.map((doc) => (
                              <li key={doc}>
                                <a
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-600 hover:underline"
                                >
                                  {doc.split("/").pop()}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-400">
                            No documents uploaded.
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setEditingClient(client)}
                          className="text-brand-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id)}
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
            {data.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500">
                No clients found yet. Add your first client using the form above.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

