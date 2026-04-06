// config.js
const CLERK_PUBLISHABLE_KEY = 'pk_test_ZnVuLWNyYWItNTEuY2xlcmsuYWNjb3VudHMuZGV2JA'; // Your Clerk publishable key
const SUPABASE_URL = 'https://okeimzznmvmxcehlhzrb.supabase.co';
const SUPABASE_ANON_KEY = 'NDY3MH0.VCnfyeSF6BFvnpxj6puTdAqEF_gyFLKVIzu4z6toz-0'; // Your Supabase anon key

// Initialize Supabase with Clerk JWT injection
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: async (url, options = {}) => {
      const token = await window.Clerk.session?.getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return fetch(url, options);
    }
  }
});

window.supabase = supabaseClient;

// Initialize Clerk
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.Clerk.load({ publishableKey: CLERK_PUBLISHABLE_KEY });
    // Auth state change listener
    window.Clerk.addListener(({ user }) => {
      if (!user && window.location.pathname !== '/auth.html') {
        window.location.href = 'auth.html';
      }
    });
  } catch (err) {
    console.error('Clerk init error:', err);
  }
});
