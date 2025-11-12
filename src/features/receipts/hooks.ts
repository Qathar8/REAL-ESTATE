import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Receipt } from "@/types";
import {
  createReceipt,
  deleteReceipt,
  fetchReceipts,
  updateReceipt
} from "./api";

const RECEIPTS_KEY = ["receipts"];

export const useReceipts = () =>
  useQuery({
    queryKey: RECEIPTS_KEY,
    queryFn: fetchReceipts
  });

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Receipt>) => createReceipt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIPTS_KEY });
    }
  });
};

export const useUpdateReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Receipt> }) =>
      updateReceipt(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIPTS_KEY });
    }
  });
};

export const useDeleteReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIPTS_KEY });
    }
  });
};

