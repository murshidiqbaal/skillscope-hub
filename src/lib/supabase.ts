import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jkgvjtnlmvvafyvmohjv.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define search logic for profiles
export const searchProfiles = async (query: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(20);
  
  if (error) throw error;
  return data;
};

// Define search logic for learning resources
export const searchLearningResources = async (query: string) => {
  const { data, error } = await supabase
    .from("learning_resources")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20);
  
  if (error) throw error;
  return data;
};
