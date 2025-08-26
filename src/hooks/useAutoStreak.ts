import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStudyData } from '../contexts/StudyDataContext';

export function useAutoStreak() {
  const { user } = useAuth();
  const { addStreakEntry, streakData } = useStudyData();

  useEffect(() => {
    if (user) {
      // Check if streak has already been marked for today
      const today = new Date().toISOString().split("T")[0];
      const todayStreak = streakData.find(entry => entry.date === today);
      
      // Only mark streak if it hasn't been marked today
      if (!todayStreak) {
        addStreakEntry(today, 1);
      }
    }
  }, [user, addStreakEntry, streakData]);
}
