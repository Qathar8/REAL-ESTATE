import type { Property } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const PROPERTIES_TABLE = "properties";

export const fetchProperties = async () => {
  const { data, error } = await supabase
    .from(PROPERTIES_TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Property[];
};

export const fetchFeaturedProperties = async () => {
  const { data, error } = await supabase
    .from(PROPERTIES_TABLE)
    .select("*")
    .eq("isFeatured", true)
    .limit(6);
  if (error) throw error;
  return (data ?? []) as Property[];
};

export const fetchPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from(PROPERTIES_TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Property;
};

export const createProperty = async (payload: Partial<Property>) => {
  const { data, error } = await supabase
    .from(PROPERTIES_TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Property;
};

export const updateProperty = async (id: string, payload: Partial<Property>) => {
  const { data, error } = await supabase
    .from(PROPERTIES_TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Property;
};

export const deleteProperty = async (id: string) => {
  const { error } = await supabase.from(PROPERTIES_TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
};

