import { supabase } from "../lib/supabase";

export async function getData(tableName: string) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("Failed to Authenticate Login");
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("User ID", user.id);

  if (error) throw error;
  return data;
}

export async function postData(
  tableName: string,
  object: Record<string, any>
) {
  const { data, error } = await supabase
    .from(tableName)
    .insert(object)
    .select();

  if (error) throw error;
  return data;
}
