function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('clerk-signin').style.display = tab === 'signin' ? 'block' : 'none';
  document.getElementById('clerk-signup').style.display = tab === 'signup' ? 'block' : 'none';
  
  if (tab === 'signin') {
    document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
  } else {
    document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.Clerk.user) {
    window.location.href = 'profile.html';
    return;
  }

  // Mount Clerk components
  const signInDiv = document.getElementById('clerk-signin');
  const signUpDiv = document.getElementById('clerk-signup');

  await window.Clerk.mountSignIn(signInDiv, {
    appearance: { theme: 'light', variables: { colorPrimary: '#1e293b' } },
    redirectUrl: '/profile.html',
    signInForceRedirectUrl: '/profile.html'
  });

  await window.Clerk.mountSignUp(signUpDiv, {
    appearance: { theme: 'light', variables: { colorPrimary: '#1e293b' } },
    redirectUrl: '/profile.html',
    signInForceRedirectUrl: '/profile.html'
  });
});
