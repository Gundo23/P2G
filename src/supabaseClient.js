import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aeorewmfquavqdiavgem.supabase.co";

const supabaseKey = "sb_publishable_Hyr2-h64v4JkjAAhnpUfmw_2krW6wzr";

export const supabase = createClient(supabaseUrl, supabaseKey);
