import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://wdjhufbambbhxllreyor.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjYwMjU2MCwiZXhwIjoxOTMyMTc4NTYwfQ.yHFJg6Q_bt0fA5XaPCnlDHB0A3t7om4gmxBu_NN2AkI';

export const supabase = createClient(supabaseUrl, supabaseKey);