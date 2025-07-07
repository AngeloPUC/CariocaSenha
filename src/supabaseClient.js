import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hmkebogkxgetbojkypnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhta2Vib2dreGdldGJvamt5cG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDYwNDQsImV4cCI6MjA2NzQ4MjA0NH0.gQNSM18vKz2lYN35fkYZHTtb-aw4OWyRmlU6DSfqnLQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
