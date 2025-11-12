import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SiteVisit } from "@/types";
import {
  createSiteVisit,
  deleteSiteVisit,
  fetchSiteVisits,
  updateSiteVisit
} from "./api";

const SITE_VISITS_KEY = ["site_visits"];

export const useSiteVisits = () =>
  useQuery({
    queryKey: SITE_VISITS_KEY,
    queryFn: fetchSiteVisits
  });

export const useCreateSiteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SiteVisit>) => createSiteVisit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_VISITS_KEY });
    }
  });
};

export const useUpdateSiteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SiteVisit> }) =>
      updateSiteVisit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_VISITS_KEY });
    }
  });
};

export const useDeleteSiteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSiteVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_VISITS_KEY });
    }
  });
};

