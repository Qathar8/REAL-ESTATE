import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Property } from "@/types";
import {
  createProperty,
  deleteProperty,
  fetchFeaturedProperties,
  fetchProperties,
  fetchPropertyById,
  updateProperty
} from "./api";

const PROPERTIES_KEY = ["properties"];

export const useProperties = () =>
  useQuery({
    queryKey: PROPERTIES_KEY,
    queryFn: fetchProperties
  });

export const useFeaturedProperties = () =>
  useQuery({
    queryKey: [...PROPERTIES_KEY, "featured"],
    queryFn: fetchFeaturedProperties
  });

export const useProperty = (id?: string) =>
  useQuery({
    queryKey: [...PROPERTIES_KEY, id],
    queryFn: () => fetchPropertyById(id as string),
    enabled: Boolean(id)
  });

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Property>) => createProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Property> }) =>
      updateProperty(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
      queryClient.setQueryData([...PROPERTIES_KEY, data.id], data);
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
    }
  });
};

