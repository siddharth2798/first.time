
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Initialize the Supabase client directly from environment variables
// This ensures credentials are not hardcoded in the source configuration
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);
