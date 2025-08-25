import React from "react";

interface ProgressBarProps {
  progress: number;
  total: number;
  height?: number;
  showPercentage?: boolean;
  className?: string;
  isTimeBased?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  height = 4,
  showPercentage = true,
  className = "",
  isTimeBased = false,
}) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  const formatTime = (seconds: number) => {
    if (isTimeBased) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    }
    return seconds.toString();
  };

  const displayText = isTimeBased
    ? `${formatTime(progress)}/${formatTime(total)} (${percentage}%)`
    : `${progress}/${total} (${percentage}%)`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {displayText}
          </span>
        )}
      </div>
      <div
        className="w-full bg-gray极客时间 dark:bg-gray-700 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="bg-red-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
