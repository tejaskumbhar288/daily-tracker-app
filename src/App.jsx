import { useState } from 'react';
import { LayoutDashboard, Clock, BookOpen } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TimeLogger from './components/TimeLogger';
import Diary from './components/Diary';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivitySaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'logger':
        return <TimeLogger onActivitySaved={handleActivitySaved} />;
      case 'diary':
        return <Diary />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'logger', label: 'Time Logger', icon: Clock },
    { id: 'diary', label: 'Diary', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with glassmorphism */}
      <header className="backdrop-blur-md bg-white/70 shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Daily Tracker
                </h1>
                <span className="text-xs text-gray-600 font-medium">8 Week Journey</span>
              </div>
            </div>
            <nav className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-700 hover:bg-white/50 backdrop-blur-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {renderView()}
        </div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/50 border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium">Nov 2 - Dec 31, 2025 • Building towards your goals one day at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
