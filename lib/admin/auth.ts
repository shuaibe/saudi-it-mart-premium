import { redirect } from "next/navigation";
import { getAdminEmail } from "../supabase/env";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../supabase/server";

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = getAdminEmail();

  if (!user || user.email?.toLowerCase() !== adminEmail) {
    redirect("/admin/login");
  }

  return { supabase: getSupabaseAdminClient(), user };
}
