import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Plus, Target, CheckCircle2, Circle, Calendar, Edit3, Trash2 } from 'lucide-react';

const Roadmap: React.FC = () => {
  const { roadmapItems, addRoadmapItem, updateRoadmapItem, deleteRoadmapItem } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    milestones: [{ id: '1', title: '', completed: false }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const milestones = formData.milestones.filter(m => m.title.trim());
    
    if (editingItem) {
      updateRoadmapItem(editingItem, {
        ...formData,
        milestones: milestones.map((m, index) => ({
          ...m,
          id: m.id || Date.now().toString() + index
        }))
      });
    } else {
      addRoadmapItem({
        ...formData,
        completed: false,
        milestones: milestones.map((m, index) => ({
          ...m,
          id: Date.now().toString() + index
        }))
      });
    }
    
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      milestones: [{ id: '1', title: '', completed: false }]
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      milestones: item.milestones.length > 0 ? item.milestones : [{ id: '1', title: '', completed: false }]
    });
    setEditingItem(item.id);
    setShowForm(true);
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { id: Date.now().toString(), title: '', completed: false }
      ]
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index: number, title: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => 
        i === index ? { ...m, title } : m
      )
    }));
  };

  const toggleMilestone = (itemId: string, milestoneId: string) => {
    const item = roadmapItems.find(item => item.id === itemId);
    if (!item) return;

    const updatedMilestones = item.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const allCompleted = updatedMilestones.every(m => m.completed);
    
    updateRoadmapItem(itemId, {
      milestones: updatedMilestones,
      completed: allCompleted
    });
  };

  const getProgressPercentage = (milestones: any[]) => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              Study Roadmap
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan your study journey with milestones and goals
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormData({
                title: '',
                description: '',
                dueDate: '',
                milestones: [{ id: '1', title: '', completed: false }]
              });
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingItem ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Milestones
                    </label>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Milestone
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                        {formData.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editingItem ? 'Update Goal' : 'Add Goal'}
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

        {/* Roadmap Items */}
        <div className="space-y-8">
          {roadmapItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                No goals set yet
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Create your first study goal to start building your roadmap
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              {roadmapItems.map((item, index) => (
                <div key={item.id} className="relative flex items-start gap-6 pb-8">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                    item.completed 
                      ? 'bg-green-500' 
                      : getProgressPercentage(item.milestones) > 0
                        ? 'bg-purple-500'
                        : 'bg-gray-400'
                  }`}>
                    {item.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : (
                      <Target className="w-8 h-8 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                          item.completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {item.description}
                          </p>
                        )}
                        {item.dueDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Target: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRoadmapItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {item.milestones.length > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Progress
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {getProgressPercentage(item.milestones)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getProgressPercentage(item.milestones)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {item.milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Milestones
                        </h4>
                        {item.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-3">
                            <button
                              onClick={() => toggleMilestone(item.id, milestone.id)}
                              className="flex-shrink-0"
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                              )}
                            </button>
                            <span className={`text-sm ${
                              milestone.completed 
                                ? 'line-through text-gray-500 dark:text-gray-400' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;