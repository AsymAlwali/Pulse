let currentUser = null;

// Check if already logged in
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'profile.html';
  }
});

function showTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
  
  if (tab === 'signin') {
    document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
    document.getElementById('signinForm').style.display = 'block';
  } else {
    document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
    document.getElementById('signupForm').style.display = 'block';
  }
}

// Sign In with Email/Password
document.getElementById('signinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    showError(error.message);
  } else {
    window.location.href = 'profile.html';
  }
});

// Sign Up with Email/Password
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  const { data, error } = await supabase.auth.signUp({
    email,    password,
    options: {
      data: {
        full_name: name
      }
    }
  });
  
  if (error) {
    showError(error.message);
  } else {
    // Create user profile
    await createProfile(data.user.id, name, email);
    window.location.href = 'profile.html';
  }
});

// Sign In with Google
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile.html'
    }
  });
  
  if (error) {
    showError(error.message);
  }
}

// Create user profile in database
async function createProfile(userId, name, email) {
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: name,
      email: email,
      created_at: new Date().toISOString()
    });
  
  if (error) console.error('Profile creation error:', error);
}

function showError(message) {
  const errorDiv = document.getElementById('authError');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {    errorDiv.style.display = 'none';
  }, 5000);
}
