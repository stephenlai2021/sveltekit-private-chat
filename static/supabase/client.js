import { createClient } from '@supabase/supabase-js'

// To deploy on Vercel, we need to begin with 'process.'
let process

let supabase

if (process && process.env) {
  // Vercel uses process.env.VARIABLE to import the environments
  supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
} else {
  // Sveltekit uses import.meta.env.VARIABLE
  supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
}

export default supabase 


