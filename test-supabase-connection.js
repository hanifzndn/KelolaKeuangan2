const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from your .env.local
const supabaseUrl = 'https://nzuvshitooqmdzlwekxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dXZzaGl0b29xbWR6bHdla3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTA1NDUsImV4cCI6MjA3MzU2NjU0NX0.7u5_dikV7HJ9Ki_Kmg1Y-8SrhWRP-odvLjgZvSykVc4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  try {
    console.log('Testing Supabase authentication...');
    
    // Test signup
    console.log('\n1. Testing signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User'
        }
      }
    });
    
    if (signupError) {
      console.error('Signup error:', signupError.message);
      return;
    }
    
    console.log('Signup successful:', signupData);
    
    // Test login
    console.log('\n2. Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginError) {
      console.error('Login error:', loginError.message);
    } else {
      console.log('Login successful:', loginData);
    }
    
    // Test logout
    console.log('\n3. Testing logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('Logout error:', logoutError.message);
    } else {
      console.log('Logout successful');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testAuth();