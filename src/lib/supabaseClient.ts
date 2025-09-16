// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Get URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Always create client in production/development, only use mock in local development without env vars
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null