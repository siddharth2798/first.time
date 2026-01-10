
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { CONFIG } from './config.ts';

// Use placeholders if config is empty to prevent client initialization errors
const supabaseUrl = CONFIG.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = CONFIG.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
