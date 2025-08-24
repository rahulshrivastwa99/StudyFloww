import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface StreakData {
  date: string;
  completed: boolean;
  tasksCompleted: number;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface CheckInItem {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastChecked: string;
  streak: number;
  completed: boolean;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

interface StudyDataContextType {
  streakData: StreakData[];
  todoItems: TodoItem[];
  notes: Note[];
  roadmapItems: RoadmapItem[];
  checkInItems: CheckInItem[];
  youtubePlaylists: YouTubePlaylist[];
  currentStreak: number;
  totalTasks: number;
  completedTasks: number;
  
  // Streak functions
  addStreakEntry: (date: string, tasksCompleted: number) => void;
  
  // Todo functions
  addTodoItem: (item: Omit<TodoItem, 'id'>) => void;
  updateTodoItem: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodoItem: (id: string) => void;
  
  // Notes functions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Roadmap functions
  addRoadmapItem: (item: Omit<RoadmapItem, 'id'>) => void;
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => void;
  deleteRoadmapItem: (id: string) => void;
  
  // CheckIn functions
  addCheckInItem: (item: Omit<CheckInItem, 'id'>) => void;
  updateCheckInItem: (id: string, updates: Partial<CheckInItem>) => void;
  deleteCheckInItem: (id: string) => void;
  
  // YouTube functions
  addYouTubePlaylist: (playlist: Omit<YouTubePlaylist, 'id'>) => void;
  updateYouTubePlaylist: (id: string, updates: Partial<YouTubePlaylist>) => void;
  deleteYouTubePlaylist: (id: string) => void;
}

const StudyDataContext = createContext<StudyDataContextType | undefined>(undefined);

export function StudyDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData[]>([]);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [checkInItems, setCheckInItems] = useState<CheckInItem[]>([]);
  const [youtubePlaylists, setYouTubePlaylists] = useState<YouTubePlaylist[]>([]);

  // Load data from Supabase or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // Load from Supabase for authenticated users
        try {
          const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading user data:', error);
            return;
          }

          // Organize data by type
          const userData: any = {};
          data?.forEach(item => {
            userData[item.data_type] = item.data;
          });

          setStreakData(userData.streakData || []);
          setTodoItems(userData.todoItems || []);
          setNotes(userData.notes || []);
          setRoadmapItems(userData.roadmapItems || []);
          setCheckInItems(userData.checkInItems || []);
          setYouTubePlaylists(userData.youtubePlaylists || []);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      } else {
        // Load from localStorage for non-authenticated users (fallback)
        const stored = localStorage.getItem('studyData');
        if (stored) {
          const data = JSON.parse(stored);
          setStreakData(data.streakData || []);
          setTodoItems(data.todoItems || []);
          setNotes(data.notes || []);
          setRoadmapItems(data.roadmapItems || []);
          setCheckInItems(data.checkInItems || []);
          setYouTubePlaylists(data.youtubePlaylists || []);
        }
      }
    };
    loadData();
  }, [user]);

  // Save data to Supabase or localStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (user) {
        // Save to Supabase for authenticated users
        const dataTypes = [
          { type: 'streakData', data: streakData },
          { type: 'todoItems', data: todoItems },
          { type: 'notes', data: notes },
          { type: 'roadmapItems', data: roadmapItems },
          { type: 'checkInItems', data: checkInItems },
          { type: 'youtubePlaylists', data: youtubePlaylists },
        ];

        for (const item of dataTypes) {
          try {
            await supabase
              .from('user_data')
              .upsert({
                user_id: user.id,
                data_type: item.type,
                data: item.data,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id,data_type'
              });
          } catch (error) {
            console.error(`Error saving ${item.type}:`, error);
          }
        }
      } else {
        // Save to localStorage for non-authenticated users (fallback)
        const data = {
          streakData,
          todoItems,
          notes,
          roadmapItems,
          checkInItems,
          youtubePlaylists,
        };
        localStorage.setItem('studyData', JSON.stringify(data));
      }
    };

    // Debounce saves to avoid too many requests
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [user, streakData, todoItems, notes, roadmapItems, checkInItems, youtubePlaylists]);

  // Calculate current streak
  const currentStreak = React.useMemo(() => {
    const sorted = [...streakData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (const entry of sorted) {
      if (entry.completed && entry.date <= today) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [streakData]);

  const totalTasks = todoItems.length;
  const completedTasks = todoItems.filter(item => item.completed).length;

  // Streak functions
  const addStreakEntry = (date: string, tasksCompleted: number) => {
    setStreakData(prev => {
      const existing = prev.find(entry => entry.date === date);
      if (existing) {
        return prev.map(entry => 
          entry.date === date 
            ? { ...entry, tasksCompleted, completed: true }
            : entry
        );
      }
      return [...prev, { date, completed: true, tasksCompleted }];
    });
  };

  // Todo functions
  const addTodoItem = (item: Omit<TodoItem, 'id'>) => {
    const newItem: TodoItem = { ...item, id: Date.now().toString() };
    setTodoItems(prev => [...prev, newItem]);
  };

  const updateTodoItem = (id: string, updates: Partial<TodoItem>) => {
    setTodoItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteTodoItem = (id: string) => {
    setTodoItems(prev => prev.filter(item => item.id !== id));
  };

  // Notes functions
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Roadmap functions
  const addRoadmapItem = (item: Omit<RoadmapItem, 'id'>) => {
    const newItem: RoadmapItem = { ...item, id: Date.now().toString() };
    setRoadmapItems(prev => [...prev, newItem]);
  };

  const updateRoadmapItem = (id: string, updates: Partial<RoadmapItem>) => {
    setRoadmapItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteRoadmapItem = (id: string) => {
    setRoadmapItems(prev => prev.filter(item => item.id !== id));
  };

  // CheckIn functions
  const addCheckInItem = (item: Omit<CheckInItem, 'id'>) => {
    const newItem: CheckInItem = { ...item, id: Date.now().toString() };
    setCheckInItems(prev => [...prev, newItem]);
  };

  const updateCheckInItem = (id: string, updates: Partial<CheckInItem>) => {
    setCheckInItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteCheckInItem = (id: string) => {
    setCheckInItems(prev => prev.filter(item => item.id !== id));
  };

  // YouTube functions
  const addYouTubePlaylist = (playlist: Omit<YouTubePlaylist, 'id'>) => {
    const newPlaylist: YouTubePlaylist = { ...playlist, id: Date.now().toString() };
    setYouTubePlaylists(prev => [...prev, newPlaylist]);
  };

  const updateYouTubePlaylist = (id: string, updates: Partial<YouTubePlaylist>) => {
    setYouTubePlaylists(prev => prev.map(playlist => 
      playlist.id === id ? { ...playlist, ...updates } : playlist
    ));
  };

  const deleteYouTubePlaylist = (id: string) => {
    setYouTubePlaylists(prev => prev.filter(playlist => playlist.id !== id));
  };

  const value: StudyDataContextType = {
    streakData,
    todoItems,
    notes,
    roadmapItems,
    checkInItems,
    youtubePlaylists,
    currentStreak,
    totalTasks,
    completedTasks,
    addStreakEntry,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem,
    addNote,
    updateNote,
    deleteNote,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    addCheckInItem,
    updateCheckInItem,
    deleteCheckInItem,
    addYouTubePlaylist,
    updateYouTubePlaylist,
    deleteYouTubePlaylist,
  };

  return (
    <StudyDataContext.Provider value={value}>
      {children}
    </StudyDataContext.Provider>
  );
}

export function useStudyData() {
  const context = useContext(StudyDataContext);
  if (context === undefined) {
    throw new Error('useStudyData must be used within a StudyDataProvider');
  }
  return context;
}