import type { Receipt } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const RECEIPTS_TABLE = "receipts";

export const fetchReceipts = async () => {
  const { data, error } = await supabase
    .from(RECEIPTS_TABLE)
    .select("*, client:clients(*), property:properties(*)")
    .order("issued_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Receipt[];
};

export const createReceipt = async (payload: Partial<Receipt>) => {
  const { data, error } = await supabase
    .from(RECEIPTS_TABLE)
    .insert(payload)
    .select("*, client:clients(*), property:properties(*)")
    .single();
  if (error) throw error;
  return data as Receipt;
};

export const updateReceipt = async (id: string, payload: Partial<Receipt>) => {
  const { data, error } = await supabase
    .from(RECEIPTS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*, client:clients(*), property:properties(*)")
    .single();
  if (error) throw error;
  return data as Receipt;
};

export const deleteReceipt = async (id: string) => {
  const { error } = await supabase.from(RECEIPTS_TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
};

