import { redirect } from "next/navigation";
import { isAdminUser } from "./authorization";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../supabase/server";

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isAdminUser(supabase, user.id))) {
    redirect("/admin/login");
  }

  return { supabase: getSupabaseAdminClient(), user };
}
