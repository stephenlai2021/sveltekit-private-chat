import { RealtimeClient } from '@supabase/realtime-js'

// To deploy on Vercel, we need to begin with 'process.'
let process

let client

if (process && process.env) {
  // Vercel uses process.env.VARIABLE to import the environments
  client = new RealtimeClient(process.env.VITE_REALTIME_URL);
} else {
  // Sveltekit uses import.meta.env.VARIABLE
  client = new RealtimeClient(import.meta.env.VITE_REALTIME_URL);
}
client.connect()

export default client

