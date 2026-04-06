window.addEventListener('DOMContentLoaded', async () => {
  if (!window.Clerk.user) {
    window.location.href = 'auth.html';
    return;
  }

  // Mount user button in navbar
  const userBtn = document.getElementById('clerk-user-btn');
  await window.Clerk.mountUserButton(userBtn);

  // Pre-fill name
  const name = window.Clerk.user.fullName || window.Clerk.user.firstName || 'User';
  document.getElementById('userName').textContent = name;

  // Check if profile already exists
  const { data } = await window.supabase
    .from('profiles')
    .select('is_setup_complete')
    .eq('user_id', window.Clerk.user.id)
    .single();

  if (data?.is_setup_complete) {
    window.location.href = 'dashboard.html';
  }
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const timezone = document.getElementById('timezone').value;
  const mainGoal = document.getElementById('mainGoal').value;
  const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(cb => cb.value);
  const userId = window.Clerk.user.id;

  // Save profile
  await window.supabase.from('profiles').upsert({
    user_id: userId,
    timezone,
    goals: selectedGoals,
    main_goal: mainGoal,
    is_setup_complete: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  // Create initial user data
  await window.supabase.from('user_data').upsert({
    user_id: userId,
     {
      habits: [],
      sleep: [],
      learning: [],
      goals: mainGoal ? [{ name: mainGoal, current: 0, target: 100, id: Date.now() }] : [],
      streak: 0,
      last_active: new Date().toISOString(),
      activity: [{ text: ' Account created!', timestamp: new Date().toISOString() }]
    },
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  window.location.href = 'dashboard.html';
});
