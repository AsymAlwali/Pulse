let currentUser = null;

window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = 'auth.html';
    return;
  }
  
  currentUser = session.user;
  
  // Check if profile already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  
  if (profile && profile.is_setup_complete) {
    window.location.href = 'dashboard.html';
  }
  
  // Pre-fill name if available
  if (profile?.full_name) {
    document.getElementById('displayName').value = profile.full_name;
  }
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const displayName = document.getElementById('displayName').value;
  const timezone = document.getElementById('timezone').value;
  const mainGoal = document.getElementById('mainGoal').value;
  
  // Get selected goals
  const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
    .map(cb => cb.value);
  
  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      timezone: timezone,
      goals: selectedGoals,
      main_goal: mainGoal,
      is_setup_complete: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentUser.id);
  
  if (error) {
    alert('Error saving profile: ' + error.message);
    return;
  }
  
  // Create initial user data
  await supabase
    .from('user_data')
    .insert({
      user_id: currentUser.id,
      data: {
        habits: [],
        sleep: [],
        learning: [],
        goals: mainGoal ? [{ name: mainGoal, current: 0, target: 100 }] : [],
        streak: 0,
        last_active: new Date().toISOString()
      }
    });
  
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
});
