import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Plus, List, CheckCircle2, Circle, Calendar, Trash2, Edit3, TrendingUp } from 'lucide-react';

const CheckInList: React.FC = () => {
  const { checkInItems, addCheckInItem, updateCheckInItem, deleteCheckInItem } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateCheckInItem(editingItem, formData);
    } else {
      addCheckInItem({
        ...formData,
        lastChecked: '',
        streak: 0,
        completed: false
      });
    }
    setFormData({ title: '', frequency: 'daily' });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      frequency: item.frequency
    });
    setEditingItem(item.id);
    setShowForm(true);
  };

  const handleCheckIn = (itemId: string) => {
    const item = checkInItems.find(item => item.id === itemId);
    if (!item) return;

    const today = new Date().toISOString().split('T')[0];
    const lastChecked = item.lastChecked;
    let newStreak = item.streak;

    if (lastChecked) {
      const lastDate = new Date(lastChecked);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (item.frequency === 'daily' && diffDays === 1) {
        newStreak += 1;
      } else if (item.frequency === 'weekly' && diffDays <= 7) {
        newStreak += 1;
      } else if (item.frequency === 'monthly' && diffDays <= 31) {
        newStreak += 1;
      } else if (diffDays > getFrequencyDays(item.frequency)) {
        newStreak = 1; // Reset streak if too much time passed
      } else {
        newStreak += 1;
      }
    } else {
      newStreak = 1; // First check-in
    }

    updateCheckInItem(itemId, {
      lastChecked: today,
      streak: newStreak,
      completed: true
    });

    // Reset completed status after a few seconds for visual feedback
    setTimeout(() => {
      updateCheckInItem(itemId, { completed: false });
    }, 2000);
  };

  const getFrequencyDays = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 31;
      default: return 1;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'weekly': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'monthly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const canCheckIn = (item: any) => {
    if (!item.lastChecked) return true;
    
    const today = new Date().toISOString().split('T')[0];
    const lastChecked = new Date(item.lastChecked).toISOString().split('T')[0];
    
    if (lastChecked === today) return false;
    
    const diffTime = new Date(today).getTime() - new Date(item.lastChecked).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= getFrequencyDays(item.frequency);
  };

  const totalStreak = checkInItems.reduce((sum, item) => sum + item.streak, 0);
  const activeCheckIns = checkInItems.filter(item => item.streak > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <List className="w-8 h-8 text-green-600" />
              Check-In List
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your habits and stay accountable with regular check-ins
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormData({ title: '', frequency: 'daily' });
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Check-In
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Streaks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStreak}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Habits</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeCheckIns}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Habits</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{checkInItems.length}</p>
              </div>
              <List className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingItem ? 'Edit Check-In' : 'Add New Check-In'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habit Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Morning Exercise, Daily Reading"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add Check-In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Check-In Items */}
        <div className="space-y-4">
          {checkInItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                No check-ins created yet
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Add your first habit to start building accountability
              </p>
            </div>
          ) : (
            checkInItems.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCheckIn(item.id)}
                      disabled={!canCheckIn(item)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        item.completed
                          ? 'bg-green-500 text-white'
                          : canCheckIn(item)
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(item.frequency)}`}>
                          {item.frequency}
                        </span>
                        {item.streak > 0 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            🔥 {item.streak} streak
                          </span>
                        )}
                        {item.lastChecked && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(item.lastChecked).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCheckInItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!canCheckIn(item) && item.lastChecked && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      ✅ Already checked in today! Next check-in available {
                        item.frequency === 'daily' ? 'tomorrow' :
                        item.frequency === 'weekly' ? 'next week' : 'next month'
                      }.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInList;