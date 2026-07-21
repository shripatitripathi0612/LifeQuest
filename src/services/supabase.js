import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * `supabase` is null when no credentials are provided in `.env`.
 * The rest of the app checks `isSupabaseConfigured` and falls back to a
 * fully-functional local persistence layer (see services/localAuth.js and
 * store/gameStore.js) so `npm run dev` works immediately with zero setup.
 *
 * To go live: copy `.env.example` to `.env`, fill in your Supabase project
 * URL + anon key, and run the SQL in `supabase/schema.sql` against your project.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
