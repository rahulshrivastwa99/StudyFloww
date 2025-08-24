import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [audioError, setAudioError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const focusTime = 25 * 60; // 25 minutes
  const shortBreak = 5 * 60; // 5 minutes
  const longBreak = 15 * 60; // 15 minutes

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(console.error);
    }
  }, []);

  const playAlarmSound = useCallback(() => {
    try {
      // Clean up previous audio context if it exists
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }

      // Create audio context with proper error handling
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported");
      }

      audioContextRef.current = new AudioContextClass();

      // Resume audio context if suspended (required on some browsers)
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      // Create a more pleasant alarm sound (multiple tones)
      const playTone = (
        frequency: number,
        startTime: number,
        duration: number,
        volume: number = 0.3
      ) => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play a pleasant chime sequence (C-E-G chord progression)
      const now = audioContextRef.current.currentTime;
      playTone(523.25, now, 0.5, 0.2); // C5
      playTone(659.25, now + 0.1, 0.5, 0.15); // E5
      playTone(783.99, now + 0.2, 0.8, 0.1); // G5

      // Add a second chime
      playTone(523.25, now + 0.8, 0.5, 0.2); // C5
      playTone(659.25, now + 0.9, 0.5, 0.15); // E5
      playTone(783.99, now + 1.0, 0.8, 0.1); // G5

      setAudioError(false);
    } catch (error) {
      console.error("Could not play alarm sound:", error);
      setAudioError(true);

      // Fallback: show visual alert if audio fails
      document.title = sessionType === "focus" ? "Break Time!" : "Focus Time!";

      // Reset title after 3 seconds
      setTimeout(() => {
        document.title = "StudyFlow - Focus Mode";
      }, 3000);
    }
  }, [sessionType]);

  const handleSessionComplete = useCallback(() => {
    console.log("Session complete - starting transition", {
      sessionType,
      sessionCount,
    });

    // First stop the timer
    setIsRunning(false);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Play alarm sound
    playAlarmSound();

    // Show notification (with error handling)
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(
          sessionType === "focus" ? "Break Time!" : "Focus Time!",
          {
            body:
              sessionType === "focus"
                ? "Great work! Time for a break."
                : "Break is over. Ready to focus?",
            icon: "/favicon.ico",
            tag: "pomodoro-timer", // Prevent multiple notifications
          }
        );
      } catch (error) {
        console.error("Notification failed:", error);
      }
    }

    // Transition to next session
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
  }, [
    sessionType,
    sessionCount,
    longBreak,
    shortBreak,
    customTime,
    playAlarmSound,
  ]);

  // Timer effect with proper cleanup
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            // Don't call handleSessionComplete here to avoid closure issues
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining]);

  // Separate effect to handle session completion
  useEffect(() => {
    if (isRunning && timeRemaining === 0) {
      handleSessionComplete();
    }
  }, [timeRemaining, isRunning, handleSessionComplete]);

  const toggleTimer = () => {
    console.log("Toggle timer clicked. Current state:", isRunning);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    console.log("Reset timer clicked");
    setIsRunning(false);

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
    return totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
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

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 p-2 sm:p-2.5 md:p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-200 z-10 hover:scale-105 active:scale-95 shadow-lg"
        aria-label="Exit focus mode"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Main Content Container */}
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
            {/* Session Info */}
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                {sessionType === "focus" ? "🎯 Focus Time" : "☕ Break Time"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 px-2 sm:px-4">
                {sessionType === "focus"
                  ? "Time to concentrate and be productive"
                  : sessionCount % 4 === 0
                  ? "Take a long break - you've earned it!"
                  : "Short break - stretch and relax"}
              </p>
              <div className="text-xs sm:text-sm md:text-base text-gray-400">
                Sessions completed: {sessionCount}
              </div>
              {sessionType === "focus" && (
                <div className="text-xs sm:text-sm md:text-base text-blue-400">
                  Session length:{" "}
                  {customTime < 1
                    ? `${Math.round(customTime * 60)} seconds`
                    : `${customTime} minutes`}
                </div>
              )}
              {audioError && (
                <div className="text-xs sm:text-sm text-yellow-400 bg-yellow-900/20 px-3 py-2 rounded-lg max-w-xs sm:max-w-sm mx-auto">
                  ⚠️ Audio unavailable - check browser title for alerts
                </div>
              )}
            </div>

            {/* Timer Display */}
            <div className="flex justify-center py-2 sm:py-4 md:py-6">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    className={
                      sessionType === "focus"
                        ? "text-blue-500"
                        : "text-green-500"
                    }
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${
                        2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)
                      }`,
                      transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mono font-bold text-white">
                      {formatTime(timeRemaining)}
                    </div>
                    {timeRemaining <= 10 && timeRemaining > 0 && isRunning && (
                      <div className="text-xs sm:text-sm md:text-base text-red-400 animate-pulse mt-1 sm:mt-2">
                        Almost done!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
                <button
                  onClick={toggleTimer}
                  className={`p-3 sm:p-4 md:p-5 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    isRunning
                      ? "bg-red-600 hover:bg-red-700 shadow-red-500/25"
                      : "bg-green-600 hover:bg-green-700 shadow-green-500/25"
                  } text-white shadow-lg`}
                  aria-label={isRunning ? "Pause timer" : "Start timer"}
                >
                  {isRunning ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 sm:p-4 md:p-5 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/25"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              </div>

              {/* Timer Status Indicator */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
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

              {/* Custom Time Settings */}
              {sessionType === "focus" && !isRunning && (
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium">
                    Focus duration:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-lg mx-auto">
                    {[10 / 60, 15, 25, 45, 60].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handleCustomTimeChange(minutes)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] ${
                          Math.abs(customTime - minutes) < 0.01
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
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Current:{" "}
                    {customTime < 1
                      ? `${Math.round(customTime * 60)} seconds`
                      : `${customTime} minutes`}{" "}
                    ({formatTime(customTime * 60)})
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs sm:text-sm md:text-base text-gray-400 space-y-2 sm:space-y-3 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto px-2 sm:px-4">
              <p>
                <strong>Focus Sessions:</strong> Work with full concentration,
                avoid distractions.
              </p>
              <p>
                <strong>Break Time:</strong> Step away from work, stretch,
                hydrate, or rest your eyes.
              </p>
              <p className="text-xs sm:text-sm opacity-75">
                Based on the Pomodoro Technique: 25min focus → 5min break →
                repeat
              </p>
              <p className="text-xs sm:text-sm opacity-75 text-blue-300">
                🔊 Audio alarm will play when timer ends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
