/**
 * Supabase Client Initialization
 * 
 * This file exports a configured Supabase client instance.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * Import this client in your components to interact with Supabase:
 * import { supabase } from './supabaseClient';
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set
const isConfigured = supabaseUrl && supabaseAnonKey

// Log warning in development if not configured
if (!isConfigured) {
  console.warn(
    '⚠️ Supabase not configured!\n' +
    'Create a .env file in the project root with:\n' +
    '  VITE_SUPABASE_URL=your-supabase-url\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'The app will run in demo mode without database functionality.'
  )
}

// Create client only if configured, otherwise create a mock client
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is available
export const isSupabaseConfigured = () => isConfigured
