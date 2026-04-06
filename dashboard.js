let currentUser = null;
let userData = {
  habits: [],
  sleep: [],
  learning: [],
  goals: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadUserData();
  renderAll();
});

// Auth Functions
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    updateUserInfo();
  }
}

function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html'
    }
  });
  if (error) alert('Error signing in: ' + error.message);
}

async function signInWithEmail() {
  const email = prompt('Enter your email:');
  if (!email) return;
  
  const { error } = await supabase.auth.signInWithOtp({
    email: email
  });
    if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Check your email for the magic link!');
  }
}

function updateUserInfo() {
  const userInfo = document.getElementById('userInfo');
  userInfo.innerHTML = `
    <span>Welcome, ${currentUser.email.split('@')[0]}</span>
    <button onclick="signOut()" class="btn btn-small btn-secondary">Sign Out</button>
  `;
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.reload();
}

// Data Functions
async function loadUserData() {
  if (!currentUser) {
    // Load from localStorage if not authenticated
    const saved = localStorage.getItem('pulseData');
    if (saved) {
      userData = JSON.parse(saved);
    }
    return;
  }
  
  // Load from Supabase
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', currentUser.id)
    .single();
  
  if (data) {
    userData = data.data;
  }
}

async function saveUserData() {
  if (!currentUser) {
    // Save to localStorage
    localStorage.setItem('pulseData', JSON.stringify(userData));
    return;
  }
    // Save to Supabase
  const { error } = await supabase
    .from('user_data')
    .upsert({
      user_id: currentUser.id,
       userData,
      updated_at: new Date().toISOString()
    });
  
  if (error) console.error('Error saving:', error);
}

// Navigation
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionName).classList.add('active');
  
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

// Habits
function addHabit() {
  const name = prompt('Enter habit name:');
  if (!name) return;
  
  userData.habits.push({
    id: Date.now(),
    name: name,
    completed: false,
    streak: 0,
    createdAt: new Date().toISOString()
  });
  
  saveUserData();
  renderHabits();
  updateStats();
}

function toggleHabit(id) {
  const habit = userData.habits.find(h => h.id === id);
  if (habit) {    habit.completed = !habit.completed;
    if (habit.completed) {
      habit.streak += 1;
      addActivity(`Completed habit: ${habit.name}`);
    }
    saveUserData();
    renderHabits();
    updateStats();
  }
}

function deleteHabit(id) {
  if (confirm('Delete this habit?')) {
    userData.habits = userData.habits.filter(h => h.id !== id);
    saveUserData();
    renderHabits();
    updateStats();
  }
}

function renderHabits() {
  const container = document.getElementById('habitsList');
  if (userData.habits.length === 0) {
    container.innerHTML = '<p class="empty-state">No habits yet. Add your first habit!</p>';
    return;
  }
  
  container.innerHTML = userData.habits.map(habit => `
    <div class="habit-card">
      <div class="habit-info">
        <h3>${habit.name}</h3>
        <p>🔥 ${habit.streak} day streak</p>
      </div>
      <div class="habit-actions">
        <input 
          type="checkbox" 
          class="habit-checkbox" 
          ${habit.completed ? 'checked' : ''}
          onchange="toggleHabit(${habit.id})"
        >
        <button class="btn-delete" onclick="deleteHabit(${habit.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Sleep
async function logSleep() {
  const hours = parseFloat(document.getElementById('sleepHours').value);
  if (!hours || hours < 0 || hours > 24) {    alert('Please enter valid hours (0-24)');
    return;
  }
  
  userData.sleep.push({
    hours: hours,
    date: new Date().toISOString()
  });
  
  addActivity(`Logged ${hours}h of sleep`);
  document.getElementById('sleepHours').value = '';
  saveUserData();
  renderSleep();
  updateStats();
}

function renderSleep() {
  const sleepList = document.getElementById('sleepHistoryList');
  const avgSleep = document.getElementById('avgSleep');
  const sleepEntries = document.getElementById('sleepEntries');
  const bestSleep = document.getElementById('bestSleep');
  
  if (userData.sleep.length === 0) {
    sleepList.innerHTML = '<p class="empty-state">No sleep logs yet</p>';
    avgSleep.textContent = '--h';
    sleepEntries.textContent = '0';
    bestSleep.textContent = '--h';
    return;
  }
  
  const total = userData.sleep.reduce((sum, s) => sum + s.hours, 0);
  const avg = (total / userData.sleep.length).toFixed(1);
  const best = Math.max(...userData.sleep.map(s => s.hours));
  
  avgSleep.textContent = `${avg}h`;
  sleepEntries.textContent = userData.sleep.length;
  bestSleep.textContent = `${best}h`;
  
  sleepList.innerHTML = userData.sleep
    .slice(-10)
    .reverse()
    .map(sleep => `
      <div class="history-item">
        <span>😴 ${sleep.hours}h</span>
        <span class="history-date">${new Date(sleep.date).toLocaleDateString()}</span>
      </div>
    `).join('');
}

// Learningasync function logLearning() {
  const topic = document.getElementById('learnTopic').value.trim();
  const minutes = parseInt(document.getElementById('learnMinutes').value);
  const category = document.getElementById('learnCategory').value;
  
  if (!topic || !minutes || minutes < 1) {
    alert('Please fill in all fields');
    return;
  }
  
  userData.learning.push({
    topic: topic,
    minutes: minutes,
    category: category,
    date: new Date().toISOString()
  });
  
  addActivity(`Learned ${topic} for ${minutes}m`);
  document.getElementById('learnTopic').value = '';
  document.getElementById('learnMinutes').value = '';
  saveUserData();
  renderLearning();
  updateStats();
}

function renderLearning() {
  const learnList = document.getElementById('learningHistoryList');
  const totalHours = document.getElementById('totalLearningHours');
  const learnEntries = document.getElementById('learningEntries');
  const weekLearning = document.getElementById('weekLearning');
  
  if (userData.learning.length === 0) {
    learnList.innerHTML = '<p class="empty-state">No learning logs yet</p>';
    totalHours.textContent = '0h';
    learnEntries.textContent = '0';
    weekLearning.textContent = '0h';
    return;
  }
  
  const totalMins = userData.learning.reduce((sum, l) => sum + l.minutes, 0);
  const totalH = (totalMins / 60).toFixed(1);
  
  // Calculate this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekMins = userData.learning
    .filter(l => new Date(l.date) > weekAgo)
    .reduce((sum, l) => sum + l.minutes, 0);
  const weekH = (weekMins / 60).toFixed(1);
    totalHours.textContent = `${totalH}h`;
  learnEntries.textContent = userData.learning.length;
  weekLearning.textContent = `${weekH}h`;
  
  learnList.innerHTML = userData.learning
    .slice(-10)
    .reverse()
    .map(learn => `
      <div class="history-item">
        <div>
          <strong>${learn.topic}</strong>
          <div style="font-size: 0.8rem; color: var(--gray-600);">${learn.category}</div>
        </div>
        <div style="text-align: right;">
          <div>${learn.minutes}m</div>
          <div class="history-date">${new Date(learn.date).toLocaleDateString()}</div>
        </div>
      </div>
    `).join('');
}

// Goals
function addGoal() {
  const name = document.getElementById('goalName').value.trim();
  const target = parseInt(document.getElementById('goalTarget').value);
  const current = parseInt(document.getElementById('goalCurrent').value) || 0;
  
  if (!name || !target || target < 1) {
    alert('Please fill in all fields');
    return;
  }
  
  userData.goals.push({
    id: Date.now(),
    name: name,
    target: target,
    current: current,
    createdAt: new Date().toISOString()
  });
  
  addActivity(`Added goal: ${name}`);
  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalCurrent').value = '0';
  saveUserData();
  renderGoals();
  updateStats();
}

function updateGoal(id, newCurrent) {  const goal = userData.goals.find(g => g.id === id);
  if (goal) {
    goal.current = parseInt(newCurrent);
    saveUserData();
    renderGoals();
    updateStats();
  }
}

function deleteGoal(id) {
  if (confirm('Delete this goal?')) {
    userData.goals = userData.goals.filter(g => g.id !== id);
    saveUserData();
    renderGoals();
    updateStats();
  }
}

function renderGoals() {
  const container = document.getElementById('goalsList');
  if (userData.goals.length === 0) {
    container.innerHTML = '<p class="empty-state">No goals yet. Add your first goal!</p>';
    return;
  }
  
  container.innerHTML = userData.goals.map(goal => {
    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
    return `
      <div class="goal-card">
        <div class="goal-header">
          <h3>${goal.name}</h3>
          <button class="btn-delete" onclick="deleteGoal(${goal.id})">Delete</button>
        </div>
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="goal-stats">
          <div>
            <input 
              type="number" 
              value="${goal.current}" 
              min="0" 
              max="${goal.target}"
              onchange="updateGoal(${goal.id}, this.value)"
              style="width: 100px; padding: 0.5rem;"
            >
            <span> / ${goal.target}</span>
          </div>
          <div class="goal-percentage">${percentage}%</div>
        </div>      </div>
    `;
  }).join('');
}

// Activity
function addActivity(text) {
  const activity = {
    text: text,
    timestamp: new Date().toISOString()
  };
  
  if (!userData.activity) userData.activity = [];
  userData.activity.unshift(activity);
  if (userData.activity.length > 20) userData.activity.pop();
  
  saveUserData();
  renderActivity();
}

function renderActivity() {
  const container = document.getElementById('recentActivityList');
  const activity = userData.activity || [];
  
  if (activity.length === 0) {
    container.innerHTML = '<p class="empty-state">No activity yet. Start tracking!</p>';
    return;
  }
  
  container.innerHTML = activity.map(item => `
    <div class="activity-item">
      <span>${item.text}</span>
      <span class="activity-date">${new Date(item.timestamp).toLocaleString()}</span>
    </div>
  `).join('');
}

// Stats
function updateStats() {
  // Habits
  const completed = userData.habits.filter(h => h.completed).length;
  const total = userData.habits.length;
  document.getElementById('habitsDone').textContent = `${completed}/${total}`;
  
  // Sleep
  if (userData.sleep.length > 0) {
    const last = userData.sleep[userData.sleep.length - 1];
    document.getElementById('lastSleep').textContent = `${last.hours}h`;
  }
    // Learning
  const today = new Date().toDateString();
  const todayLearning = userData.learning
    .filter(l => new Date(l.date).toDateString() === today)
    .reduce((sum, l) => sum + l.minutes, 0);
  document.getElementById('learningToday').textContent = `${todayLearning}m`;
  
  // Goals
  if (userData.goals.length > 0) {
    const totalProgress = userData.goals.reduce((sum, g) => {
      return sum + (g.current / g.target) * 100;
    }, 0);
    const avgProgress = Math.round(totalProgress / userData.goals.length);
    document.getElementById('goalProgress').textContent = `${avgProgress}%`;
  }
  
  // Streak
  const maxStreak = userData.habits.reduce((max, h) => Math.max(max, h.streak), 0);
  document.getElementById('streakCount').textContent = `${maxStreak} days`;
  
  // Today's progress
  const todayProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById('todayProgress').textContent = `${todayProgress}%`;
}

// Render all
function renderAll() {
  renderHabits();
  renderSleep();
  renderLearning();
  renderGoals();
  renderActivity();
  updateStats();
    }
