import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { VirtualTour } from "@/types";
import {
  createVirtualTour,
  deleteVirtualTour,
  fetchVirtualTours,
  updateVirtualTour
} from "./api";

const VIRTUAL_TOURS_KEY = ["virtual_tours"];

export const useVirtualTours = () =>
  useQuery({
    queryKey: VIRTUAL_TOURS_KEY,
    queryFn: fetchVirtualTours
  });

export const useCreateVirtualTour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<VirtualTour>) => createVirtualTour(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIRTUAL_TOURS_KEY });
    }
  });
};

export const useUpdateVirtualTour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: Partial<VirtualTour>;
    }) => updateVirtualTour(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIRTUAL_TOURS_KEY });
    }
  });
};

export const useDeleteVirtualTour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVirtualTour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIRTUAL_TOURS_KEY });
    }
  });
};

