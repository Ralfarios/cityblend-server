import { createClient } from '@supabase/supabase-js';
import { envConfig } from 'src/common/configs/env.config';

export const supabase = createClient(
  envConfig.supabaseUrl,
  envConfig.supabaseApiKey,
);
