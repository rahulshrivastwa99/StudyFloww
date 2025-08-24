import React, { useState } from "react";
import { useStudyData } from "../contexts/StudyDataContext";
import { Calendar, TrendingUp, Award, Plus } from "lucide-react";

type DayCell = {
  day: number;
  date: string;
  completed: boolean;
  tasksCompleted: number;
  isToday: boolean;
  isPast: boolean;
  isOtherMonth?: boolean;
} | null;

const StreakTracker: React.FC = () => {
  const { streakData, currentStreak, addStreakEntry } = useStudyData();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tasksCompleted, setTasksCompleted] = useState(1);

  // allow week start to be Sunday (0) or Monday (1)
  const [startOfWeek, setStartOfWeek] = useState<0 | 1>(0);

  const handleAddEntry = () => {
    addStreakEntry(selectedDate, tasksCompleted);
    setTasksCompleted(1);
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const generateMonthCalendar = (): DayCell[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // shift start day according to startOfWeek (0 = Sunday, 1 = Monday)
    const rawStartDay = firstDay.getDay(); // 0 (Sun) .. 6 (Sat)
    const startDay = (rawStartDay - startOfWeek + 7) % 7;

    const days: DayCell[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateString = dateObj.toISOString().split("T")[0];
      const entryData = streakData.find((entry) => entry.date === dateString);

      days.push({
        day,
        date: dateString,
        completed: entryData?.completed || false,
        tasksCompleted: entryData?.tasksCompleted || 0,
        isToday: dateString === today.toISOString().split("T")[0],
        isPast: dateObj < new Date(today.toDateString()), // compare date-only
      });
    }

    return days;
  };

  // New: compute current week days (7 cells) for mobile view to avoid overlapping
  const generateCurrentWeek = (): DayCell[] => {
    // Determine today's index in week relative to startOfWeek
    const rawTodayIndex = today.getDay(); // 0..6
    const todayIndex = (rawTodayIndex - startOfWeek + 7) % 7; // 0..6
    // Calculate the Date object for the start of the week
    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - todayIndex);

    const weekDays: DayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(weekStartDate);
      dateObj.setDate(weekStartDate.getDate() + i);
      const dateString = dateObj.toISOString().split("T")[0];
      const entryData = streakData.find((entry) => entry.date === dateString);

      weekDays.push({
        day: dateObj.getDate(),
        date: dateString,
        completed: entryData?.completed || false,
        tasksCompleted: entryData?.tasksCompleted || 0,
        isToday: dateString === today.toISOString().split("T")[0],
        isPast: dateObj < new Date(today.toDateString()),
        isOtherMonth: dateObj.getMonth() !== currentMonth,
      });
    }

    return weekDays;
  };

  const calendarDays = generateMonthCalendar();
  const weekViewDays = generateCurrentWeek();

  const baseWeekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekDays = baseWeekDays
    .slice(startOfWeek)
    .concat(baseWeekDays.slice(0, startOfWeek));

  const longestStreak = React.useMemo(() => {
    const sorted = [...streakData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    let maxStreak = 0;
    let current = 0;

    for (const entry of sorted) {
      if (entry.completed) {
        current++;
        maxStreak = Math.max(maxStreak, current);
      } else {
        current = 0;
      }
    }

    return maxStreak;
  }, [streakData]);

  const totalDaysStudied = streakData.filter((entry) => entry.completed).length;
  const totalTasksCompleted = streakData.reduce(
    (sum, entry) => sum + (entry.tasksCompleted || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
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
                <p className="text-orange-100 text-sm font-medium">
                  Current Streak
                </p>
                <p className="text-4xl font-bold">{currentStreak}</p>
                <p className="text-orange-100 text-sm">days</p>
              </div>
              <Award className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Longest Streak
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {longestStreak}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">days</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Days
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {totalDaysStudied}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  studied
                </p>
              </div>
              <Calendar className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Add Entry Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Log Study Session
          </h3>
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
                onChange={(e) =>
                  setTasksCompleted(parseInt(e.target.value) || 1)
                }
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
          <div className="flex items-start justify-between mb-4 gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            {/* Toggle for start of week */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Week starts:
              </span>
              <button
                onClick={() => setStartOfWeek(0)}
                className={`px-3 py-1 rounded ${
                  startOfWeek === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                } text-sm`}
              >
                Sun
              </button>
              <button
                onClick={() => setStartOfWeek(1)}
                className={`px-3 py-1 rounded ${
                  startOfWeek === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                } text-sm`}
              >
                Mon
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-xs sm:text-sm">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* MOBILE: show only current week to avoid overlapping (hidden on md+) */}
          <div className="md:hidden">
            <div className="grid grid-cols-7 gap-2">
              {weekViewDays.map((day, index) => (
                <div key={index} className="w-full">
                  {day && (
                    <div
                      className={`
                        w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                        h-12
                        ${day.isOtherMonth ? "opacity-60" : ""}
                        ${
                          day.completed
                            ? "bg-green-500 text-white shadow-md"
                            : day.isToday
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                            : day.isPast
                            ? "bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-sm">{day.day}</span>
                        {day.completed && day.tasksCompleted > 0 && (
                          <span className="text-xs mt-1">
                            •{day.tasksCompleted}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP / TABLET: full month calendar (hidden on small screens) */}
          <div className="hidden md:block">
            <div className="overflow-x-auto -mx-2 px-2">
              <div className="min-w-[560px] md:min-w-0">
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="w-full">
                      {day && (
                        <div
                          className={`
                            w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                            h-10 sm:h-12 md:h-14
                            ${
                              day.completed
                                ? "bg-green-500 text-white shadow-md"
                                : day.isToday
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                                : day.isPast
                                ? "bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }
                          `}
                        >
                          <div className="flex items-center gap-1">
                            <span>{day.day}</span>
                            {day.completed && day.tasksCompleted > 0 && (
                              <span className="text-xs ml-1">
                                •{day.tasksCompleted}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {!day && <div className="h-10 sm:h-12 md:h-14"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">
                Completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 dark:bg-red-900/20 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Missed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;
