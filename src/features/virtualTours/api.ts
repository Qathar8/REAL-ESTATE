import type { VirtualTour } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const VIRTUAL_TOURS_TABLE = "virtual_tours";

export const fetchVirtualTours = async () => {
  const { data, error } = await supabase
    .from(VIRTUAL_TOURS_TABLE)
    .select("*, property:properties(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as VirtualTour[];
};

export const createVirtualTour = async (payload: Partial<VirtualTour>) => {
  const { data, error } = await supabase
    .from(VIRTUAL_TOURS_TABLE)
    .insert(payload)
    .select("*, property:properties(*)")
    .single();
  if (error) throw error;
  return data as VirtualTour;
};

export const updateVirtualTour = async (
  id: string,
  payload: Partial<VirtualTour>
) => {
  const { data, error } = await supabase
    .from(VIRTUAL_TOURS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*, property:properties(*)")
    .single();
  if (error) throw error;
  return data as VirtualTour;
};

export const deleteVirtualTour = async (id: string) => {
  const { error } = await supabase
    .from(VIRTUAL_TOURS_TABLE)
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
};

