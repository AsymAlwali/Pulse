// Initialize Supabase
const SUPABASE_URL = 'https://okeimzznmvmxcehlhzrb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWltenpubXZteGNlaGxoenJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODg2NzAsImV4cCI6MjA5MTA2NDY3MH0.VCnfyeSF6BFvnpxj6puTdAqEF_gyFLKVIzu4z6toz-0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
