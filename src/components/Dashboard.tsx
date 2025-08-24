import React, { useState, useEffect } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { TrendingUp, CheckCircle, FileText, Target, Quote } from 'lucide-react';

const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Education is the most powerful weapon which you can use to change the world.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "The beautiful thing about learning is nobody can take it away from you.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

const Dashboard: React.FC = () => {
  const { 
    currentStreak, 
    totalTasks, 
    completedTasks, 
    notes, 
    roadmapItems,
    todoItems 
  } = useStudyData();
  
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem('dailyQuote');
    const savedDate = localStorage.getItem('quoteDate');
    
    if (savedDate === today && savedQuote) {
      setCurrentQuote(savedQuote);
    } else {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setCurrentQuote(randomQuote);
      localStorage.setItem('dailyQuote', randomQuote);
      localStorage.setItem('quoteDate', today);
    }
  }, []);

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedRoadmapItems = roadmapItems.filter(item => item.completed).length;
  const upcomingTasks = todoItems
    .filter(task => !task.completed && new Date(task.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const statsCards = [
    {
      title: 'Current Streak',
      value: currentStreak,
      unit: 'days',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300'
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      unit: `of ${totalTasks}`,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      title: 'Notes Created',
      value: notes.length,
      unit: 'notes',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      title: 'Roadmap Progress',
      value: completedRoadmapItems,
      unit: `of ${roadmapItems.length}`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to StudyFlow
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your focused study companion for consistent learning
          </p>
        </div>

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start space-x-4">
            <Quote className="w-8 h-8 flex-shrink-0 mt-1 opacity-80" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Daily Motivation</h2>
              <p className="text-lg italic leading-relaxed opacity-95">"{currentQuote}"</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.title}
                className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover animate-slide-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-sm font-medium ${card.textColor} mb-2`}>
                  {card.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {card.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Completion Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Overall Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Task Completion</span>
                <span className="font-bold text-gray-900 dark:text-white">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full progress-bar transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              {totalTasks > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {completedTasks}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {totalTasks - completedTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks
            </h3>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;