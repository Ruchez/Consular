import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gewoltwhitupkjbvosby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld29sdHdoaXR1cGtqYnZvc2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzMyNjcsImV4cCI6MjA4ODgwOTI2N30.ytR-2IEP2kZ2PpLSJZThxyofBd6oJWp351_A_FuBGlw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  console.log('Testing Supabase Connection...');
  
  const { data, error } = await supabase.from('students').insert([
    {
      full_name: 'Test Setup',
      phone_number: '+254712345678',
      passport_number: 'TEST' + Math.floor(Math.random() * 100000),
      school: 'Test University',
      next_of_kin_name: 'Test Kin',
      next_of_kin_phone: '+254700000000',
    }
  ]);

  if (error) {
    console.error('❌ SUPABASE ERROR DETECTED:');
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log('✅ SUPABASE INSERT SUCCESS:');
    console.log(data);
  }
}

test();
