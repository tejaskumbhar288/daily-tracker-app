import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { getActivities, getStats } from '../utils/storage';
import { format, subDays } from 'date-fns';

const COLORS = {
  'DSA': '#3b82f6',
  'AI Learning': '#8b5cf6',
  'Trading': '#10b981',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const statsData = getStats();
    setStats(statsData);

    // Prepare weekly data for chart
    const activities = getActivities();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayActivities = activities.filter(a => a.date === date);

      last7Days.push({
        date: format(subDays(new Date(), i), 'MMM dd'),
        DSA: dayActivities.filter(a => a.activity === 'DSA').reduce((sum, a) => sum + a.duration, 0),
        'AI Learning': dayActivities.filter(a => a.activity === 'AI Learning').reduce((sum, a) => sum + a.duration, 0),
        Trading: dayActivities.filter(a => a.activity === 'Trading').reduce((sum, a) => sum + a.duration, 0),
      });
    }
    setWeeklyData(last7Days);
  };

  if (!stats) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  const pieData = [
    { name: 'DSA', value: stats.byCategory.DSA.week },
    { name: 'AI Learning', value: stats.byCategory['AI Learning'].week },
    { name: 'Trading', value: stats.byCategory.Trading.week },
  ].filter(item => item.value > 0);

  // Calculate target progress (3 hrs/day * 7 days = 21 hrs/week)
  const weeklyTarget = 21;
  const weeklyProgress = (stats.weekTotal / weeklyTarget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 font-medium">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-10 h-10 text-white/90" />
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{((stats.todayTotal/3)*100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Today's Hours</p>
            <p className="text-4xl font-bold text-white mb-1">{stats.todayTotal}</p>
            <p className="text-white/70 text-xs">Target: 3 hrs</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-10 h-10 text-white/90" />
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{((stats.weekTotal/21)*100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">This Week</p>
            <p className="text-4xl font-bold text-white mb-1">{stats.weekTotal}</p>
            <p className="text-white/70 text-xs">Target: 21 hrs</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-10 h-10 text-white/90" />
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{weeklyProgress.toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Weekly Progress</p>
            <p className="text-4xl font-bold text-white mb-1">{weeklyProgress.toFixed(0)}%</p>
            <p className="text-white/70 text-xs">Of weekly goal</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-white/90" />
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Total Logs</p>
            <p className="text-4xl font-bold text-white mb-1">{stats.totalActivities}</p>
            <p className="text-white/70 text-xs">All time</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Last 7 Days Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="DSA" fill={COLORS.DSA} radius={[8, 8, 0, 0]} />
            <Bar dataKey="AI Learning" fill={COLORS['AI Learning']} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Trading" fill={COLORS.Trading} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            This Week's Distribution
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No data for this week yet
            </div>
          )}
        </div>

        {/* Category Stats */}
        <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Category Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, data]) => (
              <div
                key={category}
                className="group relative p-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS[category]}15 0%, ${COLORS[category]}05 100%)`,
                  borderLeft: `4px solid ${COLORS[category]}`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{category}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ backgroundColor: COLORS[category] }}>
                    {data.week}h
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[category] }}></span>
                    Today: {data.today}h
                  </span>
                  <span>•</span>
                  <span>Total: {data.total}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
