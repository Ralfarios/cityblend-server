export const envConfig = {
  databaseUrl: process.env.DATABASE_URL!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseApiKey: process.env.SUPABASE_API_KEY!,
} as const;
