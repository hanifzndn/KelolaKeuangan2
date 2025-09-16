// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Ganti dengan URL dan kunci API Supabase Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Hanya membuat client jika URL dan key tersedia
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null