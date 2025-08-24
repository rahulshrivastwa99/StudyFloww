import React, { useState } from "react";
import { useStudyData } from "../contexts/StudyDataContext";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
} from "lucide-react";

const TodoList: React.FC = () => {
  const { todoItems, addTodoItem, updateTodoItem, deleteTodoItem } =
    useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateTodoItem(editingItem, {
        ...formData,
        completed: false,
      });
      setEditingItem(null);
    } else {
      addTodoItem({
        ...formData,
        completed: false,
      });
    }
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "",
    });
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      priority: item.priority,
      category: item.category,
    });
    setEditingItem(item.id);
    setShowForm(true);
  };

  const filteredItems = todoItems
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) => filterPriority === "all" || item.priority === filterPriority
    )
    .filter((item) => {
      if (filterStatus === "completed") return item.completed;
      if (filterStatus === "pending") return !item.completed;
      return true;
    })
    .sort((a, b) => {
      // Sort by completion status first, then by due date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "border-gray-300 bg-white dark:bg-gray-800";
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-10 m-auto h-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Todo List
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your study tasks and track progress
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormData({
                title: "",
                description: "",
                dueDate: "",
                priority: "medium",
                category: "",
              });
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingItem ? "Edit Task" : "Add New Task"}
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value as any,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="e.g. Math, Science, History"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? "Update Task" : "Add Task"}
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

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {searchTerm ||
                filterPriority !== "all" ||
                filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first task to get started"}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-lg border-l-4 shadow-lg transition-all duration-200 hover:shadow-xl ${getPriorityColor(
                  item.priority
                )} ${item.completed ? "opacity-70" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() =>
                      updateTodoItem(item.id, { completed: !item.completed })
                    }
                    className="mt-1 flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          item.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityDot(
                          item.priority
                        )}`}
                      ></div>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {item.category && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                          {item.category}
                        </span>
                      )}

                      <span
                        className="capitalize px-2 py-1 rounded-full text-xs bg-opacity-20"
                        style={{
                          backgroundColor:
                            item.priority === "high"
                              ? "#ef4444"
                              : item.priority === "medium"
                              ? "#f59e0b"
                              : "#10b981",
                          color:
                            item.priority === "high"
                              ? "#dc2626"
                              : item.priority === "medium"
                              ? "#d97706"
                              : "#059669",
                        }}
                      >
                        {item.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTodoItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
