import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Calendar, TrendingUp, Award, Plus } from 'lucide-react';

const StreakTracker: React.FC = () => {
  const { streakData, currentStreak, addStreakEntry } = useStudyData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasksCompleted, setTasksCompleted] = useState(1);

  const handleAddEntry = () => {
    addStreakEntry(selectedDate, tasksCompleted);
    setTasksCompleted(1);
  };

  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const entryData = streakData.find(entry => entry.date === dateString);
      
      days.push({
        day,
        date: dateString,
        completed: entryData?.completed || false,
        tasksCompleted: entryData?.tasksCompleted || 0,
        isToday: dateString === today.toISOString().split('T')[0],
        isPast: date < today
      });
    }

    return days;
  };

  const calendarDays = generateCalendarData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const longestStreak = React.useMemo(() => {
    const sorted = [...streakData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const entry of sorted) {
      if (entry.completed) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }, [streakData]);

  const totalDaysStudied = streakData.filter(entry => entry.completed).length;
  const totalTasksCompleted = streakData.reduce((sum, entry) => sum + (entry.tasksCompleted || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Streak Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your daily study consistency and build lasting habits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                <p className="text-4xl font-bold">{currentStreak}</p>
                <p className="text-orange-100 text-sm">days</p>
              </div>
              <Award className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Longest Streak</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{longestStreak}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">days</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Days</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalDaysStudied}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">studied</p>
              </div>
              <Calendar className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Add Entry Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Log Study Session</h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tasks Completed
              </label>
              <input
                type="number"
                min="1"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddEntry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Session
            </button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <div className={`
                    w-full h-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                    ${day.completed 
                      ? 'bg-green-500 text-white shadow-md' 
                      : day.isToday 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                        : day.isPast
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}>
                    {day.day}
                    {day.completed && day.tasksCompleted > 0 && (
                      <span className="text-xs ml-1">•{day.tasksCompleted}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 dark:bg-red-900/20 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Missed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;