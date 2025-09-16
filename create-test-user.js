const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzuvshitooqmdzlwekxo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dXZzaGl0b29xbWR6bHdla3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTA1NDUsImV4cCI6MjA3MzU2NjU0NX0.7u5_dikV7HJ9Ki_Kmg1Y-8SrhWRP-odvLjgZvSykVc4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  try {
    console.log('Creating test user with authentication...');
    
    // First, sign up the user with a more standard email format
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test.user@domain.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User'
        },
        emailRedirectTo: 'http://localhost:3000'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError.message);
      return;
    }

    console.log('Auth user created:', authData);
    
    // If user was created successfully, also insert into users table
    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id, 
          name: 'Test User', 
          email: 'test.user@domain.com' 
        }])
        .select();

      if (userError) {
        console.error('Error inserting user data:', userError.message);
      } else {
        console.log('User data inserted successfully:', userData);
      }
    }

    console.log('\nTest user credentials:');
    console.log('Email: test.user@domain.com');
    console.log('Password: password123');
    console.log('You can now log in with these credentials in the app');
    
    // Note about email confirmation
    if (authData.user && !authData.user.email_confirmed_at) {
      console.log('\nNote: You may need to confirm your email before logging in.');
      console.log('Check your email for a confirmation link.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();