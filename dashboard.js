let currentUser = null;
let userData = {
  habits: [],
  sleep: [],
  learning: [],
  goals: [],
  streak: 0,
  last_active: null,
  activity: []
};

// Initialize app
window.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadUserData();
  calculateStreak();
  renderAll();
  updateDailyCheckIn();
});

// Check authentication
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = 'auth.html';
    return;
  }
  
  currentUser = session.user;
  updateUserInfo();
}

function updateUserInfo() {
  const userInfo = document.getElementById('userInfo');
  const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
  userInfo.innerHTML = `
    <span>Welcome, ${name}</span>
    <button onclick="signOut()" class="btn btn-small btn-secondary">Sign Out</button>
  `;
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'auth.html';
}

// Load user data from Supabase
async function loadUserData() {
  const { data, error } = await supabase    .from('user_data')
    .select('data')
    .eq('user_id', currentUser.id)
    .single();
  
  if (data) {
    userData = data.data;
  }
}

// Save user data to Supabase
async function saveUserData() {
  const { error } = await supabase
    .from('user_data')
    .upsert({
      user_id: currentUser.id,
      data: userData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
  
  if (error) console.error('Error saving:', error);
}

// Calculate streak
function calculateStreak() {
  if (!userData.last_active) return;
  
  const lastActive = new Date(userData.last_active);
  const today = new Date();
  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    // Consecutive day
    userData.streak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    userData.streak = 0;
  }
  // If diffDays === 0, already active today
}

// Daily check-in
async function updateDailyCheckIn() {
  const today = new Date().toDateString();
  const lastActive = userData.last_active ? new Date(userData.last_active).toDateString() : null;
  
  if (today !== lastActive) {
    // New day - check if streak continues    if (lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (new Date(lastActive).toDateString() === yesterday.toDateString()) {
        userData.streak += 1;
        addActivity(`🔥 Streak extended! ${userData.streak} days`);
      } else if (lastActive !== today) {
        userData.streak = 1; // Reset to 1 for new activity
        addActivity(`🔥 New streak started!`);
      }
    } else {
      userData.streak = 1;
      addActivity(`🔥 First day! Let's go!`);
    }
    
    userData.last_active = new Date().toISOString();
    await saveUserData();
    updateStats();
  }
}

// Add activity log
function addActivity(text) {
  const activity = {
    text: text,
    timestamp: new Date().toISOString()
  };
  
  if (!userData.activity) userData.activity = [];
  userData.activity.unshift(activity);
  if (userData.activity.length > 50) userData.activity.pop();
  
  saveUserData();
  renderActivity();
}

// Habits with streak tracking
async function addHabit() {
  const name = prompt('Enter habit name:');
  if (!name) return;
  
  userData.habits.push({
    id: Date.now(),
    name: name,
    completed: false,
    streak: 0,
    completedDates: [],
    createdAt: new Date().toISOString()
  });  
  addActivity(`Added habit: ${name}`);
  saveUserData();
  renderHabits();
  updateStats();
}

async function toggleHabit(id) {
  const habit = userData.habits.find(h => h.id === id);
  if (!habit) return;
  
  const today = new Date().toDateString();
  const wasCompleted = habit.completedDates.includes(today);
  
  if (!wasCompleted) {
    habit.completedDates.push(today);
    habit.streak += 1;
    addActivity(`✅ Completed: ${habit.name} (${habit.streak} day streak)`);
  } else {
    habit.completedDates = habit.completedDates.filter(d => d !== today);
    habit.streak = Math.max(0, habit.streak - 1);
    addActivity(`❌ Undone: ${habit.name}`);
  }
  
  habit.completed = habit.completedDates.length > 0;
  await saveUserData();
  renderHabits();
  updateStats();
}

async function deleteHabit(id) {
  if (!confirm('Delete this habit?')) return;
  
  userData.habits = userData.habits.filter(h => h.id !== id);
  await saveUserData();
  renderHabits();
  updateStats();
}

function renderHabits() {
  const container = document.getElementById('habitsList');
  if (!userData.habits || userData.habits.length === 0) {
    container.innerHTML = '<p class="empty-state">No habits yet. Add your first habit!</p>';
    return;
  }
  
  container.innerHTML = userData.habits.map(habit => `
    <div class="habit-card">
      <div class="habit-info">
        <h3>${habit.name}</h3>        <p>🔥 ${habit.streak} day streak</p>
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

// Sleep tracking
async function logSleep() {
  const hours = parseFloat(document.getElementById('sleepHours').value);
  if (!hours || hours < 0 || hours > 24) {
    alert('Please enter valid hours (0-24)');
    return;
  }
  
  userData.sleep.push({
    hours: hours,
    date: new Date().toISOString()
  });
  
  addActivity(`😴 Logged ${hours}h of sleep`);
  document.getElementById('sleepHours').value = '';
  await saveUserData();
  renderSleep();
  updateStats();
}

function renderSleep() {
  const sleepList = document.getElementById('sleepHistoryList');
  
  if (!userData.sleep || userData.sleep.length === 0) {
    sleepList.innerHTML = '<p class="empty-state">No sleep logs yet</p>';
    document.getElementById('avgSleep').textContent = '--h';
    document.getElementById('sleepEntries').textContent = '0';
    document.getElementById('bestSleep').textContent = '--h';
    return;
  }
  
  const total = userData.sleep.reduce((sum, s) => sum + s.hours, 0);
  const avg = (total / userData.sleep.length).toFixed(1);
  const best = Math.max(...userData.sleep.map(s => s.hours));
    document.getElementById('avgSleep').textContent = `${avg}h`;
  document.getElementById('sleepEntries').textContent = userData.sleep.length;
  document.getElementById('bestSleep').textContent = `${best}h`;
  
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

// Learning tracking
async function logLearning() {
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
  
  addActivity(`📚 Learned ${topic} for ${minutes}m`);
  document.getElementById('learnTopic').value = '';
  document.getElementById('learnMinutes').value = '';
  await saveUserData();
  renderLearning();
  updateStats();
}

function renderLearning() {
  const learnList = document.getElementById('learningHistoryList');
  
  if (!userData.learning || userData.learning.length === 0) {
    learnList.innerHTML = '<p class="empty-state">No learning logs yet</p>';
    document.getElementById('totalLearningHours').textContent = '0h';
    document.getElementById('learningEntries').textContent = '0';
    document.getElementById('weekLearning').textContent = '0h';
    return;  }
  
  const totalMins = userData.learning.reduce((sum, l) => sum + l.minutes, 0);
  const totalH = (totalMins / 60).toFixed(1);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekMins = userData.learning
    .filter(l => new Date(l.date) > weekAgo)
    .reduce((sum, l) => sum + l.minutes, 0);
  const weekH = (weekMins / 60).toFixed(1);
  
  document.getElementById('totalLearningHours').textContent = `${totalH}h`;
  document.getElementById('learningEntries').textContent = userData.learning.length;
  document.getElementById('weekLearning').textContent = `${weekH}h`;
  
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
async function addGoal() {
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
    createdAt: new Date().toISOString()  });
  
  addActivity(`🎯 Added goal: ${name}`);
  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalCurrent').value = '0';
  await saveUserData();
  renderGoals();
  updateStats();
}

async function updateGoal(id, newCurrent) {
  const goal = userData.goals.find(g => g.id === id);
  if (goal) {
    goal.current = parseInt(newCurrent);
    if (goal.current >= goal.target) {
      addActivity(`🎉 Goal completed: ${goal.name}!`);
    }
    await saveUserData();
    renderGoals();
    updateStats();
  }
}

async function deleteGoal(id) {
  if (!confirm('Delete this goal?')) return;
  
  userData.goals = userData.goals.filter(g => g.id !== id);
  await saveUserData();
  renderGoals();
  updateStats();
}

function renderGoals() {
  const container = document.getElementById('goalsList');
  
  if (!userData.goals || userData.goals.length === 0) {
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
        <div class="goal-progress-bar">          <div class="goal-progress-fill" style="width: ${percentage}%"></div>
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
        </div>
      </div>
    `;
  }).join('');
}

// Activity feed
function renderActivity() {
  const container = document.getElementById('recentActivityList');
  const activity = userData.activity || [];
  
  if (activity.length === 0) {
    container.innerHTML = '<p class="empty-state">No activity yet. Start tracking!</p>';
    return;
  }
  
  container.innerHTML = activity.slice(0, 20).map(item => `
    <div class="activity-item">
      <span>${item.text}</span>
      <span class="activity-date">${new Date(item.timestamp).toLocaleString()}</span>
    </div>
  `).join('');
}

// Update all stats
function updateStats() {
  // Streak
  document.getElementById('streakCount').textContent = `${userData.streak || 0} days`;
  
  // Habits
  const completed = userData.habits ? userData.habits.filter(h => h.completed).length : 0;
  const total = userData.habits ? userData.habits.length : 0;
  document.getElementById('habitsDone').textContent = `${completed}/${total}`;
  
  // Sleep  if (userData.sleep && userData.sleep.length > 0) {
    const last = userData.sleep[userData.sleep.length - 1];
    document.getElementById('lastSleep').textContent = `${last.hours}h`;
  }
  
  // Learning
  const today = new Date().toDateString();
  const todayLearning = userData.learning
    ? userData.learning
        .filter(l => new Date(l.date).toDateString() === today)
        .reduce((sum, l) => sum + l.minutes, 0)
    : 0;
  document.getElementById('learningToday').textContent = `${todayLearning}m`;
  
  // Goals
  if (userData.goals && userData.goals.length > 0) {
    const totalProgress = userData.goals.reduce((sum, g) => {
      return sum + (g.current / g.target) * 100;
    }, 0);
    const avgProgress = Math.round(totalProgress / userData.goals.length);
    document.getElementById('goalProgress').textContent = `${avgProgress}%`;
  }
  
  // Today's progress
  const todayProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById('todayProgress').textContent = `${todayProgress}%`;
}

// Render all sections
function renderAll() {
  renderHabits();
  renderSleep();
  renderLearning();
  renderGoals();
  renderActivity();
  updateStats();
}

// Navigation
function showSection(sectionName) {
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(sectionName).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');}
