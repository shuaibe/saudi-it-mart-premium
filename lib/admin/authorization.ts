import type { SupabaseClient } from "@supabase/supabase-js";

/** Membership is verified from the trusted signed-in Supabase user ID only. */
export async function isAdminUser(supabase: SupabaseClient, userId: string) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return !error && Boolean(data);
}