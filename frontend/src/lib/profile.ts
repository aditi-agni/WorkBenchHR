import { supabase } from "./supabase";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  mobile_number: string | null;
  employee_id: string | null;
  date_of_hire: string | null;
  company_name: string | null;
  role_title: string | null;
  avatar_url: string | null;
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data ?? null;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<void> {
  await supabase.from("profiles").upsert(profile);
}
