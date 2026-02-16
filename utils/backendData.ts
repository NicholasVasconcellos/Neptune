import { supabase } from "../lib/supabase";

export async function getData(
  tableName: string,
  filters?: Record<string, any>,
) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("Failed to Authenticate Login");
  }

  let query = supabase
    .from(tableName)
    .select("*")
    .eq("User ID", user.id);

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function postData(
  tableName: string,
  object: Record<string, any>
) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("Failed to Authenticate Login");
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert({ ...object, "User ID": user.id })
    .select();

  if (error) throw error;
  return data;
}

export async function updateData(
  tableName: string,
  id: number,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}
