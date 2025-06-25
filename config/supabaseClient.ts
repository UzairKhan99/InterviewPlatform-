import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL environment variable is required. Add it to your .env.local file."
  );
}

if (!supabaseKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required. Add it to your .env.local file."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: "fastprep-auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
