import { useState, useEffect } from 'react';
import { Play, Pause, Square, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { saveActivity, getActivitiesByDate, deleteActivity } from '../utils/storage';
import { format } from 'date-fns';

const ACTIVITIES = ['DSA', 'AI Learning', 'Trading'];
const STATUS_OPTIONS = ['Completed', 'Partial', 'Skipped'];

const TimeLogger = ({ onActivitySaved }) => {
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0]);
  const [notes, setNotes] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [todayActivities, setTodayActivities] = useState([]);
  const [manualDuration, setManualDuration] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Completed');

  useEffect(() => {
    loadActivities();
  }, [selectedDate]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadActivities = () => {
    const activities = getActivitiesByDate(selectedDate);
    setTodayActivities(activities);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    if (elapsedTime > 0) {
      const duration = parseFloat((elapsedTime / 3600).toFixed(2));
      saveActivityData(duration);
    }
    setIsTimerRunning(false);
    setElapsedTime(0);
  };

  const saveActivityData = (duration) => {
    const activity = {
      date: selectedDate,
      activity: selectedActivity,
      duration: duration,
      status: selectedStatus,
      notes: notes,
    };

    saveActivity(activity);
    setNotes('');
    setManualDuration('');
    loadActivities();
    if (onActivitySaved) onActivitySaved();
  };

  const handleManualEntry = () => {
    const duration = parseFloat(manualDuration);
    if (duration > 0) {
      saveActivityData(duration);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      deleteActivity(id);
      loadActivities();
      if (onActivitySaved) onActivitySaved();
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Skipped':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalToday = todayActivities.reduce((sum, a) => sum + a.duration, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Time Logger
        </h1>
        <p className="text-gray-600 font-medium">Track your daily progress</p>
      </div>

      {/* Date Selector with Progress */}
      <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20">
        <label className="block text-sm font-bold text-gray-700 mb-3">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
        />

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">Today's Progress</span>
            <span className="text-sm font-bold text-blue-600">{totalToday.toFixed(2)} / 3 hrs</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((totalToday / 3) * 100, 100)}%` }}
            ></div>
          </div>
          <p className={`mt-2 text-sm font-semibold ${totalToday >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
            {totalToday >= 3 ? '🎉 Goal reached! Keep it up!' : `${(3 - totalToday).toFixed(2)} hrs remaining to reach today's goal`}
          </p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Log Activity
        </h2>

        {/* Activity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Activity Type</label>
          <div className="flex gap-2 flex-wrap">
            {ACTIVITIES.map(activity => (
              <button
                key={activity}
                onClick={() => setSelectedActivity(activity)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedActivity === activity
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Status Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Status</label>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getStatusIcon(status)}
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/30 rounded-full -ml-16 -mb-16"></div>
          <div className="relative text-center">
            <div className={`text-6xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 transition-all duration-300 ${isTimerRunning ? 'animate-pulse' : ''}`}>
              {formatTime(elapsedTime)}
            </div>
            <div className="flex justify-center gap-3">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
                >
                  <Play className="w-6 h-6" />
                  Start Timer
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseTimer}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
                  >
                    <Pause className="w-6 h-6" />
                    Pause
                  </button>
                  <button
                    onClick={stopTimer}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
                  >
                    <Square className="w-6 h-6" />
                    Stop & Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="border-t-2 border-gray-200 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Or Enter Duration Manually</label>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.25"
              min="0"
              placeholder="Hours (e.g., 1.5)"
              value={manualDuration}
              onChange={(e) => setManualDuration(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
            />
            <button
              onClick={handleManualEntry}
              disabled={!manualDuration || parseFloat(manualDuration) <= 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you learn? What did you work on?"
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium resize-none"
          />
        </div>
      </div>

      {/* Today's Activities */}
      <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Activities for {format(new Date(selectedDate), 'MMMM dd, yyyy')}
        </h2>
        {todayActivities.length > 0 ? (
          <div className="space-y-3">
            {todayActivities.map((activity) => (
              <div
                key={activity.id}
                className="group relative border-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-lg">{activity.activity}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full">
                        {activity.duration}h
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        {getStatusIcon(activity.status)}
                        <span className="text-sm font-medium text-gray-700">{activity.status}</span>
                      </span>
                    </div>
                    {activity.notes && (
                      <p className="text-sm text-gray-700 mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 font-medium">
                        {activity.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      🕐 {format(new Date(activity.timestamp), 'h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No activities logged for this day yet</p>
            <p className="text-gray-400 text-sm mt-2">Start tracking your time to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeLogger;
