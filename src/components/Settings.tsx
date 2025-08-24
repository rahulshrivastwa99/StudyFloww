import React from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Palette,
  Bell,
  Download,
  Trash2,
} from "lucide-react";

interface SettingsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const handleExportData = () => {
    const studyData = localStorage.getItem("studyData");
    if (studyData) {
      const blob = new Blob([studyData], { type: "application/json" });
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
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          localStorage.setItem("studyData", JSON.stringify(data));
          window.location.reload(); // Reload to apply imported data
        } catch (error) {
          alert("Invalid backup file. Please select a valid StudyFlow backup.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("studyData");
      localStorage.removeItem("theme");
      localStorage.removeItem("dailyQuote");
      localStorage.removeItem("quoteDate");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your StudyFlow experience
          </p>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <Sun className="w-5 h-5 text-yellow-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Light
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Clean and bright
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <Moon className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Dark
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Easy on the eyes
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Management
            </h2>
          </div>

          <div className="space-y-6">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Export Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download a backup of all your study data
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Import Data */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Import Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restore from a previous backup file
                </p>
              </div>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                <Download className="w-4 h-4 rotate-180" />
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
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete all stored data (cannot be undone)
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About StudyFlow
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              StudyFlow is designed to help you build consistent study habits
              while minimizing distractions. Track your progress, organize your
              materials, and stay motivated on your learning journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Features
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• Streak tracking & motivation</li>
                  <li>• Task management & planning</li>
                  <li>• Note organization</li>
                  <li>• Goal & roadmap planning</li>
                  <li>• Distraction-free YouTube</li>
                  <li>• Focus mode</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Tips for Success
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• Set realistic daily goals</li>
                  <li>• Use focus mode during study</li>
                  <li>• Review progress regularly</li>
                  <li>• Organize notes by topic</li>
                  <li>• Back up your data regularly</li>
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
