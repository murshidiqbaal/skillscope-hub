import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Chat Messages Helpers (Updated for chat_messages table)
export const fetchChatLogs = async (query?: string) => {
  let request = supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    request = request.or(`message.ilike.%${query}%,response.ilike.%${query}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data;
};

export const saveChatLog = async (message: string, response: string, userId: string = "system-admin") => {
  const { data, error } = await supabase.from("chat_messages").insert([
    { 
      message, 
      response, 
      user_id: userId,
      sender: "AI Assistant",
      is_error: false,
      created_at: new Date().toISOString() 
    },
  ]);
  if (error) throw error;
  return data;
};

// User Profiles Helpers
export const fetchProfiles = async (query?: string) => {
  let request = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    request = request.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data;
};

// Resume Analysis Helpers
export const fetchResumeAnalyses = async () => {
  const { data, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Admin Helpers
export const checkIsAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error || !data) return false;
  return true;
};
