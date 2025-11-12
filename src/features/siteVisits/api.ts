import type { SiteVisit } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const SITE_VISITS_TABLE = "site_visits";

export const fetchSiteVisits = async () => {
  const { data, error } = await supabase
    .from(SITE_VISITS_TABLE)
    .select("*, client:clients(*), property:properties(*)")
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SiteVisit[];
};

export const createSiteVisit = async (payload: Partial<SiteVisit>) => {
  const { data, error } = await supabase
    .from(SITE_VISITS_TABLE)
    .insert(payload)
    .select("*, client:clients(*), property:properties(*)")
    .single();
  if (error) throw error;
  return data as SiteVisit;
};

export const updateSiteVisit = async (
  id: string,
  payload: Partial<SiteVisit>
) => {
  const { data, error } = await supabase
    .from(SITE_VISITS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*, client:clients(*), property:properties(*)")
    .single();
  if (error) throw error;
  return data as SiteVisit;
};

export const deleteSiteVisit = async (id: string) => {
  const { error } = await supabase
    .from(SITE_VISITS_TABLE)
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
};

