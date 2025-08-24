import React, { useState, useEffect } from "react";
import { X, Clock, Play, Pause, RotateCcw } from "lucide-react";

interface FocusModeProps {
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ onExit }) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [customTime, setCustomTime] = useState(25);

  const focusTime = 25 * 60; // 25 minutes
  const shortBreak = 5 * 60; // 5 minutes
  const longBreak = 15 * 60; // 15 minutes

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Debug logging to check if timer is working
  useEffect(() => {
    console.log("Timer state:", { isRunning, timeRemaining, sessionType });
  }, [isRunning, timeRemaining, sessionType]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const playAlarmSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create a more pleasant alarm sound (multiple tones)
      const playTone = (
        frequency: number,
        startTime: number,
        duration: number,
        volume: number = 0.3
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play a pleasant chime sequence (C-E-G chord progression)
      const now = audioContext.currentTime;
      playTone(523.25, now, 0.5, 0.2); // C5
      playTone(659.25, now + 0.1, 0.5, 0.15); // E5
      playTone(783.99, now + 0.2, 0.8, 0.1); // G5

      // Add a second chime
      playTone(523.25, now + 0.8, 0.5, 0.2); // C5
      playTone(659.25, now + 0.9, 0.5, 0.15); // E5
      playTone(783.99, now + 1.0, 0.8, 0.1); // G5
    } catch (error) {
      console.log("Could not play alarm sound:", error);
      // Fallback: try to use system beep
      try {
        // Create a simple beep sound
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeBzCH0/LNdiMFl1nAI/k7AjSBzfLZijYIF2m98OHqSDGGyfDzlTIIm1/ExO3jQkGJzO/GhzEICm6+7+OqVhYOYKzd7eKyVhEMbafs6qJUDg1fqt5qfXoHUKfg8PafUQwOPq0urkjA"
        );
      } catch (e) {
        console.log("Fallback audio also failed:", e);
      }
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);

    // Play alarm sound
    playAlarmSound();

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        sessionType === "focus" ? "Break Time!" : "Focus Time!",
        {
          body:
            sessionType === "focus"
              ? "Great work! Time for a break."
              : "Break is over. Ready to focus?",
          icon: "/favicon.ico",
        }
      );
    }

    if (sessionType === "focus") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);

      // After 4 focus sessions, take a long break
      if (newCount % 4 === 0) {
        setSessionType("break");
        setTimeRemaining(longBreak);
      } else {
        setSessionType("break");
        setTimeRemaining(shortBreak);
      }
    } else {
      setSessionType("focus");
      setTimeRemaining(customTime * 60);
    }
  };

  const toggleTimer = () => {
    console.log("Toggle timer clicked. Current state:", isRunning);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    console.log("Reset timer clicked");
    setIsRunning(false);
    if (sessionType === "focus") {
      setTimeRemaining(customTime * 60);
    } else {
      setTimeRemaining(sessionCount % 4 === 0 ? longBreak : shortBreak);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalTime =
      sessionType === "focus"
        ? customTime * 60
        : sessionCount % 4 === 0
        ? longBreak
        : shortBreak;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const handleCustomTimeChange = (minutes: number) => {
    console.log(
      "Custom time change clicked:",
      minutes,
      "Current custom time:",
      customTime
    );
    if (!isRunning && sessionType === "focus") {
      setCustomTime(minutes);
      setTimeRemaining(minutes * 60);
      console.log(
        "Time updated to:",
        minutes,
        "minutes, seconds:",
        minutes * 60
      );
    } else {
      console.log(
        "Cannot change time - isRunning:",
        isRunning,
        "sessionType:",
        sessionType
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      {/* Exit Button - Responsive positioning */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Main Content */}
      <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-0">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Session Info with enhanced time display */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {sessionType === "focus" ? "🎯 Focus Time" : "☕ Break Time"}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 px-2">
              {sessionType === "focus"
                ? "Time to concentrate and be productive"
                : sessionCount % 4 === 0
                ? "Take a long break - you've earned it!"
                : "Short break - stretch and relax"}
            </p>
            <div className="text-xs sm:text-sm text-gray-400">
              Sessions completed: {sessionCount}
            </div>
            {sessionType === "focus" && (
              <div className="text-xs text-blue-400">
                Session length:{" "}
                {customTime < 1
                  ? `${Math.round(customTime * 60)} seconds`
                  : `${customTime} minutes`}
              </div>
            )}
          </div>

          {/* Timer Display - Responsive sizing */}
          <div className="relative flex justify-center">
            {/* Progress Ring */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  className={
                    sessionType === "focus" ? "text-blue-500" : "text-green-500"
                  }
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${
                      2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)
                    }`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Responsive button sizes */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center gap-4 sm:gap-6">
              <button
                onClick={toggleTimer}
                className={`p-3 sm:p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  isRunning
                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/25"
                    : "bg-green-600 hover:bg-green-700 shadow-green-500/25"
                } text-white shadow-lg`}
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                )}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 sm:p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/25"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Timer Status Indicator */}
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isRunning
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isRunning ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                {isRunning ? "Timer Running" : "Timer Paused"}
              </div>
            </div>

            {/* Custom Time Settings - Enhanced with better feedback */}
            {sessionType === "focus" && !isRunning && (
              <div className="space-y-3">
                <p className="text-gray-300 text-xs sm:text-sm font-medium">
                  Focus duration:
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {[10 / 60, 15, 25, 45, 60].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => handleCustomTimeChange(minutes)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[60px] ${
                        customTime === minutes
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {minutes < 1
                        ? `${Math.round(minutes * 60)}s`
                        : `${minutes}m`}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Current:{" "}
                  {customTime < 1
                    ? `${Math.round(customTime * 60)} seconds`
                    : `${customTime} minutes`}{" "}
                  ({formatTime(customTime * 60)})
                </p>
              </div>
            )}
          </div>

          {/* Instructions - Responsive text and spacing */}
          <div className="text-xs sm:text-sm text-gray-400 space-y-2 max-w-sm mx-auto px-2">
            <p>
              <strong>Focus Sessions:</strong> Work with full concentration,
              avoid distractions.
            </p>
            <p>
              <strong>Break Time:</strong> Step away from work, stretch,
              hydrate, or rest your eyes.
            </p>
            <p className="text-xs opacity-75">
              Based on the Pomodoro Technique: 25min focus → 5min break → repeat
            </p>
            <p className="text-xs opacity-75 text-blue-300">
              🔊 Audio alarm will play when timer ends
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
