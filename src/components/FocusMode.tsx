import React, { useState, useEffect } from 'react';
import { X, Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface FocusModeProps {
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ onExit }) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [customTime, setCustomTime] = useState(25);

  const focusTime = 25 * 60; // 25 minutes
  const shortBreak = 5 * 60; // 5 minutes
  const longBreak = 15 * 60; // 15 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout;

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
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionType === 'focus') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      
      // After 4 focus sessions, take a long break
      if (newCount % 4 === 0) {
        setSessionType('break');
        setTimeRemaining(longBreak);
      } else {
        setSessionType('break');
        setTimeRemaining(shortBreak);
      }
    } else {
      setSessionType('focus');
      setTimeRemaining(customTime * 60);
    }

    // Play notification sound (you can implement this)
    // playNotificationSound();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (sessionType === 'focus') {
      setTimeRemaining(customTime * 60);
    } else {
      setTimeRemaining(sessionCount % 4 === 0 ? longBreak : shortBreak);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = sessionType === 'focus' 
      ? customTime * 60 
      : (sessionCount % 4 === 0 ? longBreak : shortBreak);
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const handleCustomTimeChange = (minutes: number) => {
    if (!isRunning) {
      setCustomTime(minutes);
      if (sessionType === 'focus') {
        setTimeRemaining(minutes * 60);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Session Info */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">
            {sessionType === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
          </h1>
          <p className="text-gray-300">
            {sessionType === 'focus' 
              ? 'Time to concentrate and be productive'
              : sessionCount % 4 === 0 
                ? 'Take a long break - you\'ve earned it!'
                : 'Short break - stretch and relax'
            }
          </p>
          <div className="text-sm text-gray-400">
            Sessions completed: {sessionCount}
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                className={sessionType === 'focus' ? 'text-blue-500' : 'text-green-500'}
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold text-white">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`p-4 rounded-full transition-colors ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Custom Time Settings */}
          {sessionType === 'focus' && !isRunning && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">Focus duration (minutes):</p>
              <div className="flex justify-center gap-2">
                {[15, 25, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => handleCustomTimeChange(minutes)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      customTime === minutes
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-400 space-y-2 max-w-sm mx-auto">
          <p>
            <strong>Focus Sessions:</strong> Work with full concentration, avoid distractions.
          </p>
          <p>
            <strong>Break Time:</strong> Step away from work, stretch, hydrate, or rest your eyes.
          </p>
          <p className="text-xs">
            Based on the Pomodoro Technique: 25min focus → 5min break → repeat
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;