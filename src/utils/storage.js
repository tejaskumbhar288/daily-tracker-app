// LocalStorage utility for Daily Tracker

const STORAGE_KEYS = {
  ACTIVITIES: 'daily_tracker_activities',
  DIARY_ENTRIES: 'daily_tracker_diary',
};

// Activity structure: { id, date, activity, duration, status, notes, timestamp }
export const saveActivity = (activity) => {
  const activities = getActivities();
  activities.push({
    ...activity,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  return activities;
};

export const getActivities = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  return data ? JSON.parse(data) : [];
};

export const updateActivity = (id, updates) => {
  const activities = getActivities();
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }
  return activities;
};

export const deleteActivity = (id) => {
  const activities = getActivities().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  return activities;
};

// Diary entries
export const saveDiaryEntry = (entry) => {
  const entries = getDiaryEntries();
  entries.push({
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));
  return entries;
};

export const getDiaryEntries = () => {
  const data = localStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const updateDiaryEntry = (id, updates) => {
  const entries = getDiaryEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));
  }
  return entries;
};

export const deleteDiaryEntry = (id) => {
  const entries = getDiaryEntries().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));
  return entries;
};

// Get activities for a specific date
export const getActivitiesByDate = (date) => {
  const activities = getActivities();
  return activities.filter(a => a.date === date);
};

// Get diary entries for a specific date
export const getDiaryEntriesByDate = (date) => {
  const entries = getDiaryEntries();
  return entries.filter(e => e.date === date);
};

// Statistics
export const getStats = () => {
  const activities = getActivities();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayActivities = activities.filter(a => a.date === today);
  const weekActivities = activities.filter(a => a.date >= weekAgo);

  const statsByCategory = {
    DSA: { total: 0, today: 0, week: 0 },
    'AI Learning': { total: 0, today: 0, week: 0 },
    Trading: { total: 0, today: 0, week: 0 },
  };

  activities.forEach(a => {
    if (statsByCategory[a.activity]) {
      statsByCategory[a.activity].total += a.duration;
      if (a.date === today) statsByCategory[a.activity].today += a.duration;
      if (a.date >= weekAgo) statsByCategory[a.activity].week += a.duration;
    }
  });

  return {
    todayTotal: todayActivities.reduce((sum, a) => sum + a.duration, 0),
    weekTotal: weekActivities.reduce((sum, a) => sum + a.duration, 0),
    totalActivities: activities.length,
    byCategory: statsByCategory,
  };
};
