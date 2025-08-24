import React, { useState } from "react";
import { Settings, Moon, Sun, Palette, Download, Trash2 } from "lucide-react";

// Simple theme hook that manages its own state
const useLocalTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Try to get theme from localStorage on initial load
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("studyflow-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
      // Default to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const setThemeAndSave = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("studyflow-theme", newTheme);
    }
  };

  return { theme, setTheme: setThemeAndSave };
};

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useLocalTheme();

  // Data management functions
  const handleExportData = () => {
    try {
      const allData = {
        theme: theme,
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        // Add other data from localStorage if needed
        studyData: localStorage.getItem("studyflow-data") || "{}",
        notes: localStorage.getItem("studyflow-notes") || "[]",
        tasks: localStorage.getItem("studyflow-tasks") || "[]",
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `studyflow-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Restore theme
        if (data.theme) {
          setTheme(data.theme);
        }

        // Restore other data
        if (data.studyData) {
          localStorage.setItem("studyflow-data", data.studyData);
        }
        if (data.notes) {
          localStorage.setItem("studyflow-notes", data.notes);
        }
        if (data.tasks) {
          localStorage.setItem("studyflow-tasks", data.tasks);
        }

        alert(
          "Data imported successfully! Please refresh the page to see changes."
        );
      } catch (error) {
        console.error("Import error:", error);
        alert("Invalid backup file. Please select a valid StudyFlow backup.");
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all data? This action cannot be undone.\n\nThis will delete:\n- All study sessions\n- All notes\n- All tasks\n- All settings"
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        "This is your final warning. All data will be permanently deleted. Continue?"
      );

      if (doubleConfirm) {
        try {
          // Clear all StudyFlow related data
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("studyflow-")) {
              keysToRemove.push(key);
            }
          }

          keysToRemove.forEach((key) => localStorage.removeItem(key));

          alert("All data cleared successfully! The page will refresh.");
          window.location.reload();
        } catch (error) {
          console.error("Clear data error:", error);
          alert("Failed to clear data. Please try again.");
        }
      }
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold flex items-center justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5 transition-colors ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <Settings
              className={`w-5 sm:w-6 md:w-8 lg:w-10 xl:w-12 h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 transition-colors ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
            Settings
          </h1>
          <p
            className={`mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Customize your StudyFlow experience
          </p>
        </div>

        {/* Appearance Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Palette className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-purple-600 flex-shrink-0" />
            <h2
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Appearance
            </h2>
          </div>

          <div>
            <label
              className={`block text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6 transition-colors ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                    : theme === "dark"
                    ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <Sun className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-yellow-600 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div
                    className={`font-medium text-sm sm:text-base md:text-lg lg:text-xl transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Light Theme
                  </div>
                  <div
                    className={`text-xs sm:text-sm md:text-base lg:text-lg transition-colors ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Clean and bright interface
                  </div>
                </div>
                {theme === "light" && (
                  <div className="ml-auto w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-900/30 shadow-md shadow-blue-500/20"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <Moon className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-blue-600 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div
                    className={`font-medium text-sm sm:text-base md:text-lg lg:text-xl transition-colors ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Dark Theme
                  </div>
                  <div
                    className={`text-xs sm:text-sm md:text-base lg:text-lg transition-colors ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Easy on the eyes
                  </div>
                </div>
                {theme === "dark" && (
                  <div className="ml-auto w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Download className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-green-600 flex-shrink-0" />
            <h2
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Data Management
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Export Data */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 md:p-6 rounded-lg transition-colors ${
                theme === "dark" ? "bg-green-900/20" : "bg-green-50"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium text-sm sm:text-base md:text-lg transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Export Data
                </h3>
                <p
                  className={`text-xs sm:text-sm md:text-base transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Download a backup of all your study data
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Export
              </button>
            </div>

            {/* Import Data */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 md:p-6 rounded-lg transition-colors ${
                theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium text-sm sm:text-base md:text-lg transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Import Data
                </h3>
                <p
                  className={`text-xs sm:text-sm md:text-base transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Restore from a previous backup file
                </p>
              </div>
              <label className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
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
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 md:p-6 rounded-lg transition-colors ${
                theme === "dark" ? "bg-red-900/20" : "bg-red-50"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`font-medium text-sm sm:text-base md:text-lg transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Clear All Data
                </h3>
                <p
                  className={`text-xs sm:text-sm md:text-base transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Permanently delete all stored data (cannot be undone)
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
          className={`rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 md:mb-8 transition-colors ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            About StudyFlow
          </h2>
          <div
            className={`space-y-4 sm:space-y-6 md:space-y-8 transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p className="leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
              StudyFlow is designed to help you build consistent study habits
              while minimizing distractions. Track your progress, organize your
              materials, and stay motivated on your learning journey.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6">
              <div
                className={`p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium mb-3 sm:mb-4 md:mb-5 text-sm sm:text-base md:text-lg lg:text-xl transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  ✨ Features
                </h3>
                <ul className="text-xs sm:text-sm md:text-base lg:text-lg space-y-2 sm:space-y-3 md:space-y-4">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Streak tracking & motivation</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-blue-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Task management & planning</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-purple-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Note organization</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-orange-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Goal & roadmap planning</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Distraction-free YouTube</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-indigo-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Focus mode with audio alerts</span>
                  </li>
                </ul>
              </div>
              <div
                className={`p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium mb-3 sm:mb-4 md:mb-5 text-sm sm:text-base md:text-lg lg:text-xl transition-colors ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  💡 Tips for Success
                </h3>
                <ul className="text-xs sm:text-sm md:text-base lg:text-lg space-y-2 sm:space-y-3 md:space-y-4">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Set realistic daily goals</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-blue-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Use focus mode during study</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-purple-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Review progress regularly</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-orange-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Organize notes by topic</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Back up your data regularly</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-indigo-500 mt-0.5 text-sm sm:text-base md:text-lg">
                      •
                    </span>
                    <span>Try the 10s timer to test alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div
          className={`text-center text-xs sm:text-sm md:text-base transition-colors pb-4 sm:pb-6 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>StudyFlow v1.0.0 • Built with React & Tailwind CSS</p>
          <p className="mt-1 sm:mt-2">Made with ❤️ for focused learning</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
