import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Palette,
  Download,
  Trash2,
  Upload,
} from "lucide-react";

interface SettingsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const [studyData, setStudyData] = useState({
    tasks: [],
    notes: [],
    goals: [],
    streaks: 0,
  });

  const handleExportData = () => {
    try {
      const exportData = {
        tasks: studyData.tasks,
        notes: studyData.notes,
        goals: studyData.goals,
        streaks: studyData.streaks,
        theme: theme,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studyflow-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Export failed. Please try again.");
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setStudyData({
            tasks: data.tasks || [],
            notes: data.notes || [],
            goals: data.goals || [],
            streaks: data.streaks || 0,
          });
          if (data.theme) {
            setTheme(data.theme);
          }
          alert("Data imported successfully!");
        } catch (error) {
          alert("Invalid backup file. Please select a valid StudyFlow backup.");
        }
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      setStudyData({
        tasks: [],
        notes: [],
        goals: [],
        streaks: 0,
      });
      setTheme("light");
      alert("All data has been cleared.");
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1
            className={`text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-3 transition-colors ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <SettingsIcon
              className={`w-6 sm:w-8 h-6 sm:h-8 transition-colors ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
            Settings
          </h1>
          <p
            className={`mt-1 transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Customize your StudyFlow experience
          </p>
        </div>

        {/* Appearance Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Appearance
            </h2>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-4 transition-colors ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                    : theme === "dark"
                    ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <Sun className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-left">
                  <div
                    className={`font-medium transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Light Theme
                  </div>
                  <div
                    className={`text-sm transition-colors ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Clean and bright interface
                  </div>
                </div>
                {theme === "light" && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-900/30 shadow-md shadow-blue-500/20"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <Moon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-left">
                  <div
                    className={`font-medium transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Dark Theme
                  </div>
                  <div
                    className={`text-sm transition-colors ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Easy on the eyes
                  </div>
                </div>
                {theme === "dark" && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
            <h2
              className={`text-lg sm:text-xl font-semibold transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Data Management
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Export Data */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl transition-colors ${
                theme === "dark"
                  ? "bg-green-900/20 border border-green-800"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Export Data
                </h3>
                <p
                  className={`text-sm mt-1 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Download a backup of all your study data
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Import Data */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl transition-colors ${
                theme === "dark"
                  ? "bg-blue-900/20 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Import Data
                </h3>
                <p
                  className={`text-sm mt-1 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Restore from a previous backup file
                </p>
              </div>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear Data */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl transition-colors ${
                theme === "dark"
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Clear All Data
                </h3>
                <p
                  className={`text-sm mt-1 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Permanently delete all stored data (cannot be undone)
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-semibold mb-4 transition-colors ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            About StudyFlow
          </h2>
          <div
            className={`space-y-4 transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p className="leading-relaxed">
              StudyFlow is designed to help you build consistent study habits
              while minimizing distractions. Track your progress, organize your
              materials, and stay motivated on your learning journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div
                className={`p-4 rounded-xl transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium mb-3 transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  ✨ Features
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Streak tracking & motivation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Task management & planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Note organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Goal & roadmap planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Distraction-free YouTube</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Focus mode with audio alerts</span>
                  </li>
                </ul>
              </div>
              <div
                className={`p-4 rounded-xl transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium mb-3 transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  💡 Tips for Success
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Set realistic daily goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Use focus mode during study</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Review progress regularly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Organize notes by topic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Back up your data regularly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Try the 10s timer to test alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
