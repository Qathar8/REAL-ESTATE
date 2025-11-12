import type { Client } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const CLIENTS_TABLE = "clients";

export const fetchClients = async () => {
  const { data, error } = await supabase
    .from(CLIENTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Client[];
};

export const createClient = async (payload: Partial<Client>) => {
  const { data, error } = await supabase
    .from(CLIENTS_TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Client;
};

export const updateClient = async (id: string, payload: Partial<Client>) => {
  const { data, error } = await supabase
    .from(CLIENTS_TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Client;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase.from(CLIENTS_TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
};

