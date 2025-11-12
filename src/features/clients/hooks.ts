import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Client } from "@/types";
import { createClient, deleteClient, fetchClients, updateClient } from "./api";

const CLIENTS_KEY = ["clients"];

export const useClients = () =>
  useQuery({
    queryKey: CLIENTS_KEY,
    queryFn: fetchClients
  });

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Client>) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    }
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Client> }) =>
      updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    }
  });
};

