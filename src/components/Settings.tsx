import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Settings as SettingsIcon, Moon, Sun, Palette } from "lucide-react";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

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
