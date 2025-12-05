// Test Supabase Connection - Paste this in browser console (F12)
console.log('=== Testing Supabase ===');
supabase.auth.getSession().then(r => console.log('Session:', r));
