
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Initialize with placeholders if env vars are missing to prevent "supabaseUrl is required" crash.
// The app's logic in App.tsx will detect these placeholders and switch to Demo Mode.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
